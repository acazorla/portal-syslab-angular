import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { PatientsComponent } from './patients/patients.component';
import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, NavbarComponent, PatientsComponent, RegisterPatientComponent],
  template: `
    <app-login *ngIf="!auth.isLoggedIn()" class="app-view"></app-login>

    <div *ngIf="auth.isLoggedIn()" class="app-shell">
      <app-navbar></app-navbar>

      <main class="content">
        <app-patients *ngIf="nav.currentView() === 'patients'"></app-patients>
        <app-register-patient *ngIf="nav.currentView() === 'register'"></app-register-patient>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public auth: AuthService, public nav: NavigationService) {}
}