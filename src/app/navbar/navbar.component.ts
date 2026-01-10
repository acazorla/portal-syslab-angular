import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(
    public auth: AuthService,
    private nav: NavigationService
  ) {}

  go(view: 'patients' | 'register') {
    this.nav.navigate(view);
  }

  logout() {
    this.auth.logout();
    this.nav.navigate('login');
  }
}