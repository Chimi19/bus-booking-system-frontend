import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.validateToken().pipe(
      switchMap(isValid => {
        if (isValid) {
          // If the token is valid, check the user's role
          return this.authService.getCurrentUser ().pipe(
            map(user => {
              if (user && user.roles && user.roles.toUpperCase() === 'ADMIN') {
                return true; // Allow access if the user is an Admin
              } else {
                this.router.navigate(['/dashboard']); // Redirect to dashboard if not an Admin
                return false; // Deny access
              }
            }),
            catchError(() => {
              this.router.navigate(['/dashboard']); // Redirect to dashboard on error
              return of(false); // Return false to deny access
            })
          );
        } else {
          this.router.navigate(['/login']); // Redirect to login if token is invalid
          return of(false);
        }
      }),
      catchError(() => {
        this.router.navigate(['/login']); // Handle any errors by redirecting to login
        return of(false); // Return false to deny access
      })
    );
  }
}
