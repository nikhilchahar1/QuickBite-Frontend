import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="overlay ? 'spinner-overlay' : 'spinner-inline'">
      <div class="spin-ring">
        <div></div><div></div><div></div><div></div>
      </div>
      <p *ngIf="message" class="spin-msg">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      position: fixed; inset: 0;
      background: rgba(255,255,255,0.75);
      backdrop-filter: blur(4px);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      z-index: 9998; gap: 16px;
    }
    .spinner-inline {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 48px; gap: 16px;
    }
    .spin-ring {
      display: inline-block;
      position: relative;
      width: 48px; height: 48px;
    }
    .spin-ring div {
      box-sizing: border-box;
      display: block; position: absolute;
      width: 38px; height: 38px; margin: 5px;
      border: 3px solid transparent;
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spinRing 1s cubic-bezier(0.5,0,0.5,1) infinite;
    }
    .spin-ring div:nth-child(1) { animation-delay: -0.45s; }
    .spin-ring div:nth-child(2) { animation-delay: -0.3s;  }
    .spin-ring div:nth-child(3) { animation-delay: -0.15s; }
    .spin-msg { color: var(--text-muted); font-size: 0.88rem; }
    @keyframes spinRing {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class SpinnerComponent {
  @Input() overlay = false;
  @Input() message = '';
}