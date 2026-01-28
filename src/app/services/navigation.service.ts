import { Injectable, signal } from '@angular/core';

export type ViewKey = 'patients' | 'register' | 'login' | 'change-password';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  currentView = signal<ViewKey>('login');

  navigate(view: ViewKey) {
    this.currentView.set(view);
  }
}