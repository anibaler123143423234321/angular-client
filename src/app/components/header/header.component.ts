import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UserResponse } from '@app/store/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();
  @Input() user!: UserResponse | null;
  @Input() isAuthorized!: boolean | null;
  @Output() signOut = new EventEmitter<void>();

  horaPeru: Date = new Date();
  horaEspana: Date = new Date();

  constructor() {}

  ngOnInit(): void {
    this.actualizarHoras();
    setInterval(() => {
      this.actualizarHoras();
    }, 1000); // Actualiza cada segundo
  }

  onMenuToggleDispatch(): void {
    this.menuToggle.emit();
  }

  onSignOut(): void {
    this.signOut.emit();
  }

  private actualizarHoras(): void {
    const ahora = new Date();
    this.horaPeru = new Date(ahora.toLocaleString("en-US", { timeZone: "America/Lima" }));
    this.horaEspana = new Date(ahora.toLocaleString("en-US", { timeZone: "Europe/Madrid" }));
  }

  get userImage(): string {
    // “(this.user as any).imageUrl” forzará a TypeScript a ignorar la inexistencia de la propiedad
    // y, si no existe, retornará la URL de i.pravatar.cc
    return (this.user as any)?.imageUrl
      ? (this.user as any).imageUrl
      : 'https://i.pravatar.cc/48';
  }
  
}
