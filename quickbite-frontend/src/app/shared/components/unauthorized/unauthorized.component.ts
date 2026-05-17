import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: '<p style="padding:2rem;text-align:center">🚧 Unauthorized — coming soon</p>'
})
export class UnauthorizedComponent {}
