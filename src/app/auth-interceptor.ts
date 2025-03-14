import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from "@app/services";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private notification: NotificationService
  ){}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const tokenSeguridad = localStorage.getItem('token');

    if(!tokenSeguridad) {
      return next.handle(req);
    }

    const request = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + tokenSeguridad),
    });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.error === 'TOKEN_EXPIRADO' || error.status === 401) {
          localStorage.clear();
          this.router.navigate(['/auth/login']);
          this.notification.error('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
        }
        return throwError(() => error);
      })
    );
  }
}