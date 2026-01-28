import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';
import { ModalService } from '../services/modal.service';

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
    private nav: NavigationService,
    private modal: ModalService 
  ) {}

  go(view: 'patients' | 'register' | 'change-password') {
    if (view === 'change-password') {
      this.modal.openChangePasswordModal();  // Abre el modal
    } else {
      this.nav.navigate(view);
    }
  }

  logout() {
    this.auth.logout();
    this.nav.navigate('login');
  }
}