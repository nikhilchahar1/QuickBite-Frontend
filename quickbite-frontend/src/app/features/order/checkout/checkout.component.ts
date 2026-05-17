import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { PaymentService } from '../../../core/services/payment.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { CartResponse, OrderResponse, PaymentMode, PlaceOrderRequest } from '../../../shared/models/models';
import { environment } from '../../../../environments/environment';

// Razorpay global type declaration
declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cart: CartResponse | null = null;
  loading       = true;
  placing       = false;

  // Form fields
  deliveryAddress     = '';
  specialInstructions = '';
  selectedPayment: PaymentMode = 'COD';

  paymentOptions: { value: PaymentMode; label: string; icon: string; desc: string }[] = [
    { value: 'COD',      label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
    { value: 'WALLET',   label: 'QuickBite Wallet',  icon: '💰', desc: 'Pay instantly from your wallet balance' },
    { value: 'RAZORPAY', label: 'Card / UPI',         icon: '💳', desc: 'Pay securely via Razorpay' },
  ];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      if (!cart || cart.items.length === 0) {
        this.toast.warning('Your cart is empty.');
        this.router.navigate(['/cart']);
      }
    });
    this.cartService.getCart().subscribe({
      next: () => { this.loading = false; },
      error: ()  => { this.loading = false; }
    });
  }

  placeOrder(): void {
    if (!this.deliveryAddress.trim()) {
      this.toast.error('Please enter your delivery address.');
      return;
    }
    if (!this.cart || this.cart.items.length === 0) {
      this.toast.error('Cart is empty.');
      return;
    }

    const user = this.auth.getCurrentUser()!;
    const req: PlaceOrderRequest = {
      restaurantId:        this.cart.restaurantId!,
      paymentMode:         this.selectedPayment,
      deliveryAddress:     this.deliveryAddress.trim(),
      specialInstructions: this.specialInstructions.trim() || undefined,
      totalAmount:         this.cart.totalPrice,
      discount:            this.cart.discount,
      finalAmount:         this.cart.finalPrice,
      customerEmail:       user.email,
      customerName:        user.fullName,
      appliedPromoCode:    this.cart.appliedPromoCode || undefined,
      items: this.cart.items.map(i => ({
        itemId:    i.itemId,
        itemName:  i.itemName,
        price:     i.price,
        quantity:  i.quantity,
        subtotal:  i.subtotal
      }))
    };

    this.placing = true;

    this.orderService.placeOrder(req).subscribe({
      next: (order) => {
        this.handlePayment(order);
      },
      error: (err) => {
        this.placing = false;
        this.toast.error(err?.error?.message || 'Failed to place order.');
      }
    });
  }

  private handlePayment(order: OrderResponse): void {
    if (this.selectedPayment === 'COD') {
      this.paymentService.codPayment(order.orderId, order.finalAmount).subscribe({
        next: () => this.onSuccess(order.orderId),
        error: () => this.onSuccess(order.orderId) // COD still succeeds even if payment record fails
      });
    } else if (this.selectedPayment === 'WALLET') {
      this.paymentService.walletPay(order.orderId, order.finalAmount).subscribe({
        next: () => this.onSuccess(order.orderId),
        error: (err) => {
          this.placing = false;
          this.toast.error(err?.error?.message || 'Insufficient wallet balance.');
        }
      });
    } else {
      this.openRazorpay(order);
    }
  }

  private openRazorpay(order: OrderResponse): void {
    // Step 1: Create Razorpay order on backend
    this.paymentService.createRazorpayOrder({
      amount:          order.finalAmount,
      quickbiteOrderId: order.orderId,
      description:     `QuickBite Order #${order.orderId}`
    }).subscribe({
      next: (rzpOrder) => {
        const user = this.auth.getCurrentUser()!;

        // Step 2: Open Razorpay popup
        const options = {
          key:         environment.razorpayKeyId,
          amount:      rzpOrder.amount * 100,   // paise
          currency:    rzpOrder.currency || 'INR',
          name:        'QuickBite',
          description: `Order #${order.orderId}`,
          order_id:    rzpOrder.razorpayOrderId,
          prefill: {
            name:  user.fullName,
            email: user.email,
          },
          theme: { color: '#e53935' },

          handler: (response: any) => {
            // Step 3: Verify payment on backend
            this.paymentService.verifyPayment({
              quickbiteOrderId:   order.orderId,
              razorpayOrderId:    response.razorpay_order_id,
              razorpayPaymentId:  response.razorpay_payment_id,
              razorpaySignature:  response.razorpay_signature,
              amount:             order.finalAmount
            }).subscribe({
              next: () => this.onSuccess(order.orderId),
              error: () => {
                this.placing = false;
                this.toast.error('Payment verification failed. Contact support.');
              }
            });
          },

          modal: {
            ondismiss: () => {
              this.placing = false;
              this.toast.warning('Payment cancelled. Your order is placed but unpaid.');
              this.router.navigate(['/orders', order.orderId]);
            }
          }
        };

        const rzp = new Razorpay(options);
        rzp.open();
      },
      error: (err) => {
        this.placing = false;
        this.toast.error(err?.error?.message || 'Could not initiate payment.');
      }
    });
  }

  private onSuccess(orderId: number): void {
    this.placing = false;
    this.cartService.clearLocal();
    this.toast.success('🎉 Order placed successfully!');
    this.router.navigate(['/orders', orderId]);
  }
}