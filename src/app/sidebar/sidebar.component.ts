import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../services/navigation.service';
import { ModalService } from '../services/modal.service';

interface MenuItem {
  label: string;
  icon: string;
  submenu?: SubMenuItem[];
  action?: () => void;
}

interface SubMenuItem {
  label: string;
  action: () => void;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isExpanded = false;
  expandedMenu: string | null = null;

  menuItems: MenuItem[] = [
    {
      label: 'Administración',
      icon: '📋',
      submenu: [
        {
          label: 'Listado de Atenciones',
          action: () => this.nav.navigate('patients')
        },
        {
          label: 'Registrar Paciente',
          action: () => this.nav.navigate('register')
        }
      ]
    },
    {
      label: 'Seguridad',
      icon: '🔐',
      submenu: [
        {
          label: 'Cambiar Contraseña',
          action: () => this.modal.openChangePasswordModal()
        },
        {
          label: 'Permisos' ,
          action: () => this.nav.navigate('register')
         // action: () => this.nav.navigate('permissions')
        }
      ]
    }
  ];

  constructor(
    private nav: NavigationService,
    private modal: ModalService
  ) {}

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleSubmenu(menuLabel: string): void {
    this.expandedMenu = this.expandedMenu === menuLabel ? null : menuLabel;
  }

  handleMenuClick(item: MenuItem): void {
    if (item.submenu) {
      this.toggleSubmenu(item.label);
    } else if (item.action) {
      item.action();
    }
  }

  handleSubmenuClick(action: () => void, event: Event): void {
    event.stopPropagation();
    action();
    this.isExpanded = false;  // Cierra el sidebar en móvil
  }
}