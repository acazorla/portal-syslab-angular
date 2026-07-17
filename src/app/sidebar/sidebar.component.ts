/* import { Component, inject, signal, computed } from '@angular/core'; // 1. Importaciones actualizadas
import { CommonModule } from '@angular/common';
import { NavigationService } from '../services/navigation.service';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

// Interfaces (Se mantienen igual, son correctas)
interface MenuItem {
  label: string;
  icon: string;
  roles: string[];
  submenu?: SubMenuItem[];
  action?: () => void;
}

interface SubMenuItem {
  label: string;
  action: () => void;
  roles: string[];
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
  private authService = inject(AuthService);
  // Propiedad de solo lectura (no cambia), se mantiene igual.
  menuItems: MenuItem[] = [
    {
      label: 'Epidemiología',
      icon: '🦠',
      roles: ['ADMIN', 'EPIDEMIOLOGO'],
      submenu: [
        {
          label: 'Reporte diario de Atenciones',
          action: () => this.nav.navigate('report-attentions'),
          roles: ['ADMIN', 'EPIDEMIOLOGO']
        },
        {
          label: 'Reporte diario de Medicamentos',
          action: () => this.nav.navigate('register'),
          roles: ['ADMIN', 'EPIDEMIOLOGO']
        }
      ]
    },
    {
      label: 'Administración',
      icon: '📋',
      roles: ['ADMIN'],
      submenu: [
        {
          label: 'Listado de Atenciones',
          action: () => this.nav.navigate('patients'),
          roles: ['ADMIN']
        },
        {
          label: 'Registrar Paciente',
          action: () => this.nav.navigate('register'),
          roles: ['ADMIN']
        }
      ]
    },
    {
      label: 'Gerencia',
      icon: '📊',
      roles: ['ADMIN'],
      submenu: [
        {
          label: 'Dashboard Alta Gerencia',
          action: () => this.nav.navigate('dashboard'),
          roles: ['ADMIN']
        },
        {
          label: 'Dashboard Detalle x ServicioAlta Gerencia',
          action: () => this.nav.navigate('dashboard-detalle'),
          roles: ['ADMIN']
        }
      ]
    },
    {
      label: 'Seguridad',
      icon: '🔐',
      roles: ['ADMIN'],
      submenu: [
        {
          label: 'Cambiar Contraseña',
          action: () => this.modal.openChangePasswordModal(),
          roles: ['ADMIN']
        },
        {
          label: 'Permisos',
          action: () => this.nav.navigate('register'),
          roles: ['ADMIN']
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
filteredMenuItems = computed(() => {
    const userRoles = this.authService.getUserRoles();
    if (userRoles.length === 0) return [];

    return this.menuItems
      .filter(item => item.roles.some(role => userRoles.includes(role)))
      .map(item => ({
        ...item,
        submenu: item.submenu 
          ? item.submenu.filter(sub => sub.roles.some(role => userRoles.includes(role))) 
          : undefined
      }));
  });
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
} */

/*
//📊 Gerencia
//🔧 Mantenimiento
//📋 Operaciones
//👥 Pacientes
//🧪 Laboratorio
//💰 Facturación
//📈 Indicadores
//🧑
//😷
//
*/
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../services/navigation.service';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

// Interfaces bien estructuradas
interface MenuItem {
  label: string;
  icon: string;
  roles: string[];
  submenu?: SubMenuItem[];
  action?: () => void;
}

interface SubMenuItem {
  label: string;
  action: () => void;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // 1. Inyección de dependencias (Siempre declaradas arriba para evitar problemas de referencia)
  private authService = inject(AuthService);
  private nav = inject(NavigationService);
  private modal = inject(ModalService);

  // 2. Definición del Estado Reactivo (Signals)
  isExpanded = signal<boolean>(false);
  expandedMenu = signal<string | null>(null);

  // 3. Estructura de Datos del Menú (Disponible de forma segura ya que 'nav' y 'modal' ya existen)
  menuItems: MenuItem[] = [
    {
      label: 'Epidemiología',
      icon: '🦠',
      roles: ['ADMIN', 'EPIDEMIOLOGO'],
      submenu: [
        {
          label: 'Reporte diario de Atenciones',
          action: () => this.nav.navigate('report-attentions'),
          roles: ['ADMIN', 'EPIDEMIOLOGO']
        },
        {
          label: 'Reporte diario de Medicamentos',
          action: () => this.nav.navigate('report-medications'),
          roles: ['ADMIN', 'EPIDEMIOLOGO']
        }
      ]
    },
    {
      label: 'Administración',
      icon: '📋',
      roles: ['ADMIN'],
      submenu: [
        {
          label: 'Listado de Atenciones',
          action: () => this.nav.navigate('patients'),
          roles: ['ADMIN']
        },
        {
          label: 'Registrar Paciente',
          action: () => this.nav.navigate('register'),
          roles: ['ADMIN']
        }
      ]
    },
    {
      label: 'Gerencia',
      icon: '📊',
      roles: ['ADMIN'],
      submenu: [
        {
          label: 'Dashboard Alta Gerencia',
          action: () => this.nav.navigate('dashboard'),
          roles: ['ADMIN']
        },
        {
          label: 'Dashboard Detalle x ServicioAlta Gerencia',
          action: () => this.nav.navigate('dashboard-detalle'),
          roles: ['ADMIN']
        }
      ]
    },
    {
      label: 'Seguridad',
      icon: '🔐',
      roles: ['ADMIN'],
      submenu: [
        {
          label: 'Cambiar Contraseña',
          action: () => this.modal.openChangePasswordModal(),
          roles: ['ADMIN']
        },
        {
          label: 'Permisos',
          action: () => this.nav.navigate('register'),
          roles: ['ADMIN']
        }
      ]
    }
  ];

  // 4. Cálculo reactivo computado para el render dinámico por rol
  filteredMenuItems = computed(() => {
    const userRoles = this.authService.getUserRoles();
    if (userRoles.length === 0) return [];

    return this.menuItems
      .filter(item => item.roles.some(role => userRoles.includes(role)))
      .map(item => ({
        ...item,
        submenu: item.submenu 
          ? item.submenu.filter(sub => sub.roles.some(role => userRoles.includes(role))) 
          : undefined
      }));
  });

  // 5. Métodos de interacción con estado reactivo (.update() y .set())
  toggleSidebar(): void {
    this.isExpanded.update(value => !value);
  }

  toggleSubmenu(menuLabel: string): void {
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
    this.isExpanded.set(false); // Colapsa el sidebar en dispositivos móviles tras la selección
  }
}