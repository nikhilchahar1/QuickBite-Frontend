import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../core/services/payment.service';
import { ToastService } from '../../../core/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { WalletResponse, WalletStatementResponse } from '../../../shared/models/models';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  wallet: WalletResponse | null = null;
  statements: WalletStatementResponse[] = [];
  loading    = true;
  toppingUp  = false;
  topUpAmount = 0;

  quickAmounts = [100, 200, 500, 1000];

  constructor(
    private paymentService: PaymentService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadWallet();
  }

  private loadWallet(): void {
    this.loading = true;
    this.paymentService.getWalletBalance().subscribe({
      next: wallet => {
        this.wallet = wallet;
        this.loadStatements();
      },
      error: () => { this.loading = false; }
    });
  }

  private loadStatements(): void {
    this.paymentService.getWalletStatements().subscribe({
      next: stmts => {
        this.statements = stmts.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  setQuickAmount(amount: number): void {
    this.topUpAmount = amount;
  }

  topUp(): void {
    if (!this.topUpAmount || this.topUpAmount < 10) {
      this.toast.error('Minimum top-up amount is ₹10.');
      return;
    }
    this.toppingUp = true;
    this.paymentService.topUpWallet({
      amount: this.topUpAmount,
      description: `Wallet top-up of ₹${this.topUpAmount}`
    }).subscribe({
      next: (wallet) => {
        this.wallet = wallet;
        this.toppingUp = false;
        this.topUpAmount = 0;
        this.toast.success(`₹${this.topUpAmount || ''} added to wallet!`);
        this.loadStatements();
      },
      error: (err) => {
        this.toppingUp = false;
        this.toast.error(err?.error?.message || 'Top-up failed.');
      }
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
  }
}