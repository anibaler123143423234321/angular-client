import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/models/backend/user/index';
import { NotificationService } from '@app/services';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();
  @Input() isAuthorized !: boolean | null;
  @Input() user: User | null = null;
  @Output() signOut = new EventEmitter<void>();

  constructor(
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.checkToken();
  }

  private checkToken(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/auth/login']);
      this.notification.error('No hay sesión activa');
      this.signOut.emit();
    }
  }

  closeMenu(): void {
    this.menuToggle.emit();
  }

  onSignOut(): void {
    localStorage.removeItem('token');
    this.signOut.emit();
  }

  isAdmin(): boolean {
    return this.user?.role === 'ADMIN' && !!localStorage.getItem('token');
  }

  isBackOffice(): boolean {
    return this.user?.role === 'BACKOFFICE' && !!localStorage.getItem('token');
  }
}