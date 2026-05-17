import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">

          <div class="footer-brand">
            <div class="footer-logo">🍕 Quick<strong>Bite</strong></div>
            <p>Delicious food, delivered fast. Order from the best restaurants in your city.</p>
            <div class="footer-socials">
              <a href="#" aria-label="Instagram">📸</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Facebook">👤</a>
            </div>
          </div>

          <div class="footer-col">
            <h4>Explore</h4>
            <a routerLink="/restaurants">All Restaurants</a>
            <a routerLink="/restaurants" [queryParams]="{cuisine:'Indian'}">Indian Food</a>
            <a routerLink="/restaurants" [queryParams]="{cuisine:'Chinese'}">Chinese Food</a>
            <a routerLink="/restaurants" [queryParams]="{cuisine:'Italian'}">Italian Food</a>
          </div>

          <div class="footer-col">
            <h4>For Partners</h4>
            <a routerLink="/register">List Your Restaurant</a>
            <a routerLink="/owner">Owner Dashboard</a>
          </div>

          <div class="footer-col">
            <h4>Account</h4>
            <a routerLink="/login">Sign In</a>
            <a routerLink="/register">Sign Up Free</a>
            <a routerLink="/orders">My Orders</a>
            <a routerLink="/wallet">My Wallet</a>
          </div>

        </div>

        <div class="footer-bottom">
          <p>© 2024 QuickBite. All rights reserved. Made with ❤️ for food lovers.</p>
          <div class="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--secondary-dark);
      color: rgba(255,255,255,0.65);
      padding: 56px 0 0;
      margin-top: 80px;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 48px;
      padding-bottom: 48px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .footer-logo {
      font-family: var(--font-heading);
      font-size: 1.4rem;
      color: white;
      font-weight: 700;
      margin-bottom: 14px;
      strong { color: var(--primary-light); }
    }
    .footer-brand p {
      font-size: 0.87rem;
      line-height: 1.7;
      margin-bottom: 20px;
    }
    .footer-socials {
      display: flex;
      gap: 10px;
      a {
        display: flex; align-items: center; justify-content: center;
        width: 36px; height: 36px;
        background: rgba(255,255,255,0.08);
        border-radius: 50%;
        font-size: 1rem;
        transition: background 0.2s;
        text-decoration: none;
        &:hover { background: rgba(255,255,255,0.18); }
      }
    }
    .footer-col h4 {
      color: white;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 18px;
    }
    .footer-col a {
      display: block;
      font-size: 0.87rem;
      color: rgba(255,255,255,0.6);
      margin-bottom: 10px;
      text-decoration: none;
      transition: color 0.2s;
      &:hover { color: white; }
    }
    .footer-bottom {
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      flex-wrap: wrap;
      gap: 12px;
    }
    .footer-bottom-links {
      display: flex;
      gap: 20px;
      a { color: rgba(255,255,255,0.5); text-decoration: none;
          &:hover { color: white; } }
    }
    @media (max-width: 900px) {
      .footer-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 580px) {
      .footer-grid { grid-template-columns: 1fr; gap: 28px; }
      .footer-bottom { flex-direction: column; text-align: center; }
    }
  `]
})
export class FooterComponent {}