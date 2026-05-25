import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, finalize } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
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
  wallet: WalletResponse | null         = null;
  statements: WalletStatementResponse[] = [];
  loading     = true;
  toppingUp   = false;
  topUpAmount = 0;

  quickAmounts = [100, 200, 500, 1000];

  constructor(
    private paymentService: PaymentService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    // ✅ Load both in parallel with forkJoin
    forkJoin({
      wallet:     this.paymentService.getWalletBalance().pipe(catchError(() => of(null))),
      statements: this.paymentService.getWalletStatements().pipe(catchError(() => of([])))
    }).pipe(
      finalize(() => { this.loading = false; })
    ).subscribe(({ wallet, statements }) => {
      this.wallet     = wallet;
      this.statements = (statements as WalletStatementResponse[]).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }

  setQuickAmount(amount: number): void { this.topUpAmount = amount; }

  topUp(): void {
    if (!this.topUpAmount || this.topUpAmount < 10) {
      this.toast.error('Minimum top-up is ₹10.');
      return;
    }
    const amount = this.topUpAmount;
    this.toppingUp = true;
    this.paymentService.topUpWallet({
      amount,
      description: `Wallet top-up of ₹${amount}`
    }).pipe(
      catchError(err => {
        this.toast.error(err?.error?.message || 'Top-up failed.');
        return of(null);
      }),
      finalize(() => { this.toppingUp = false; })
    ).subscribe(wallet => {
      if (!wallet) return;
      this.wallet     = wallet;
      this.topUpAmount = 0;
      this.toast.success(`₹${amount} added to wallet!`);
      // Reload statements after top-up
      this.paymentService.getWalletStatements().pipe(
        catchError(() => of([]))
      ).subscribe(stmts => {
        this.statements = (stmts as WalletStatementResponse[]).sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
  }
}