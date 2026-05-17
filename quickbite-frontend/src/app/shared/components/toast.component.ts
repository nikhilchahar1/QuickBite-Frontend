import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let t of toast.toasts()"
        class="toast toast-{{ t.type }}"
        (click)="toast.remove(t.id)">
        <span class="toast-icon">{{ getIcon(t.type) }}</span>
        <span class="toast-msg">{{ t.message }}</span>
        <button class="toast-close">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-radius: 14px;
      font-size: 0.88rem;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      pointer-events: all;
      cursor: pointer;
      animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
      min-width: 280px;
      max-width: 380px;
    }
    .toast-success { background: #1b5e20; color: white; }
    .toast-error   { background: #b71c1c; color: white; }
    .toast-warning { background: #e65100; color: white; }
    .toast-info    { background: #01579b; color: white; }
    .toast-icon    { font-size: 1rem; flex-shrink: 0; }
    .toast-msg     { flex: 1; line-height: 1.4; }
    .toast-close   {
      background: rgba(255,255,255,0.2);
      border: none; color: white;
      width: 20px; height: 20px;
      border-radius: 50%; font-size: 0.65rem;
      cursor: pointer; display: flex;
      align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateX(40px) scale(0.9); }
      to   { opacity: 1; transform: translateX(0) scale(1); }
    }
    @media (max-width: 480px) {
      .toast-container { left: 16px; right: 16px; bottom: 16px; }
      .toast { min-width: unset; }
    }
  `]
})
export class ToastComponent {
  constructor(public toast: ToastService) {}

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: '✓', error: '✕', warning: '⚠', info: 'ℹ'
    };
    return icons[type] || 'ℹ';
  }
}