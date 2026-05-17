import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: '<p style="padding:2rem;text-align:center">🚧 NotFound — coming soon</p>'
})
export class NotFoundComponent {}
