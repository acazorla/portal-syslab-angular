import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { PatientsComponent } from './patients/patients.component';
import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { NavigationService } from './services/navigation.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ModalService } from './services/modal.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, NavbarComponent, PatientsComponent, RegisterPatientComponent, ChangePasswordComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public auth: AuthService, public nav: NavigationService, public modal: ModalService) {}
}