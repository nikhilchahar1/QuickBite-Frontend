import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { ToastService } from '../../../core/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SpinnerComponent],
  templateUrl: './admin-notifications.component.html',
  styleUrls: ['./admin-notifications.component.scss']
})
export class AdminNotificationsComponent {
  title   = '';
  message = '';
  recipientIds = '';
  sending = false;
  sent    = false;

  types = ['ORDER', 'PAYMENT', 'PROMO', 'SYSTEM', 'DELIVERY'];
  selectedType = 'SYSTEM';

  constructor(private notifService: NotificationService, private toast: ToastService) {}

  sendBulk(): void {
    if (!this.title.trim() || !this.message.trim() || !this.recipientIds.trim()) {
      this.toast.error('Title, message and recipient IDs are required.');
      return;
    }
    const ids = this.recipientIds.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0);
    if (ids.length === 0) { this.toast.error('Enter valid user IDs separated by commas.'); return; }

    this.sending = true;
    this.notifService.sendBulk({ recipientIds: ids, title: this.title, message: this.message, type: this.selectedType }).subscribe({
      next: () => {
        this.sending = false; this.sent = true;
        this.toast.success(`Notification sent to ${ids.length} user(s)!`);
        setTimeout(() => { this.sent = false; this.title = ''; this.message = ''; this.recipientIds = ''; }, 3000);
      },
      error: (err) => {
        this.sending = false;
        this.toast.error(err?.error?.message || 'Failed to send notifications.');
      }
    });
  }
}