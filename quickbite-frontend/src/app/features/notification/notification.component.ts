import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { NotificationResponse } from '../../shared/models/models';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notifications: NotificationResponse[] = [];
  loading = true;
  markingAll = false;

  constructor(
    private notifService: NotificationService,
    private toast: ToastService
  ) {}

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.loading = true;
    this.notifService.getMyNotifications().subscribe({
      next: list => {
        this.notifications = list.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  markRead(id: number): void {
    const n = this.notifications.find(x => x.notificationId === id);
    if (!n || n.read) return;
    this.notifService.markAsRead(id).subscribe({
      next: updated => {
        const idx = this.notifications.findIndex(x => x.notificationId === id);
        if (idx !== -1) this.notifications[idx] = updated;
      }
    });
  }

  markAllRead(): void {
    this.markingAll = true;
    this.notifService.markAllRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map(n => ({ ...n, read: true }));
        this.markingAll = false;
        this.toast.success('All notifications marked as read.');
      },
      error: () => { this.markingAll = false; }
    });
  }

  deleteNotif(id: number): void {
    this.notifService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.notificationId !== id);
        this.toast.info('Notification deleted.');
      }
    });
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now  = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60)   return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      ORDER: '📦', PAYMENT: '💳', PROMO: '🎁',
      SYSTEM: '⚙️', DELIVERY: '🛵', REVIEW: '⭐'
    };
    return icons[type?.toUpperCase()] || '🔔';
  }
}