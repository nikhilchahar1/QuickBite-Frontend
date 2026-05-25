import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
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
  loading    = true;
  markingAll = false;

  constructor(
    private notifService: NotificationService,
    private toast: ToastService
  ) {}

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.loading = true;
    this.notifService.getMyNotifications().pipe(
      catchError(() => of([])),
      finalize(() => { this.loading = false; })  // ✅ always stops
    ).subscribe(list => {
      this.notifications = list.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }

  markRead(id: number): void {
    const n = this.notifications.find(x => x.notificationId === id);
    if (!n || n.read) return;
    this.notifService.markAsRead(id).pipe(
      catchError(() => of(null))
    ).subscribe(updated => {
      if (!updated) return;
      const idx = this.notifications.findIndex(x => x.notificationId === id);
      if (idx !== -1) this.notifications[idx] = updated;
    });
  }

  markAllRead(): void {
    this.markingAll = true;
    this.notifService.markAllRead().pipe(
      catchError(() => of(null)),
      finalize(() => { this.markingAll = false; })
    ).subscribe(() => {
      this.notifications = this.notifications.map(n => ({ ...n, read: true }));
      this.toast.success('All marked as read.');
    });
  }

  deleteNotif(id: number): void {
    this.notifService.deleteNotification(id).pipe(
      catchError(() => of(null))
    ).subscribe(() => {
      this.notifications = this.notifications.filter(n => n.notificationId !== id);
    });
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now  = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60)    return 'Just now';
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
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