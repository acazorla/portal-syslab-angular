import { Component, inject, signal } from '@angular/core'; // 1. Importaciones actualizadas
import { CommonModule } from '@angular/common';
import { NavigationService } from '../services/navigation.service';
import { ModalService } from '../services/modal.service';

// Interfaces (Se mantienen igual, son correctas)
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
  // 2. Estado reactivo con Signals (WritableSignals)
  // Reemplazamos propiedades directas por señales mutables.
  isExpanded = signal<boolean>(false);
  expandedMenu = signal<string | null>(null);

  // Propiedad de solo lectura (no cambia), se mantiene igual.
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
        },
        {
          label: 'Dashboard Alta Gerencia',
          action: () => this.nav.navigate('dashboard')
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
          label: 'Permisos',
          action: () => this.nav.navigate('register')
          // action: () => this.nav.navigate('permissions')
        }
      ]
    }
  ];

  // 3. Inyección de dependencias moderna con inject()
  // Reemplaza la inyección en el constructor.
  private nav = inject(NavigationService);
  private modal = inject(ModalService);

  // 4. Constructor cargado eliminado (no es necesario ahora).

  // 5. Métodos actualizados para usar la API de Signals (.set() / .update())
  toggleSidebar(): void {
    // Usamos .update() para invertir el valor booleano de la señal
    this.isExpanded.update(value => !value);
  }

  toggleSubmenu(menuLabel: string): void {
    // Usamos .set() para establecer un nuevo valor.
    // Leemos el valor actual consumiendo la señal con ().
    this.expandedMenu.set(this.expandedMenu() === menuLabel ? null : menuLabel);
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
    // Cerramos el sidebar en móvil usando .set()
    this.isExpanded.set(false);
  }
}