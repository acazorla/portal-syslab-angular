import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  showChangePasswordModal = signal(false);

  openChangePasswordModal(): void {
    this.showChangePasswordModal.set(true);
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal.set(false);
  }
}