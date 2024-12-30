import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HomeService } from '../_services/home.service';

@Injectable({
  providedIn: 'root',
})
export class PremiumGuard implements CanActivate {
  constructor(private homeService: HomeService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const userId = route.paramMap.get('id');

    return this.homeService.checkUserPremium().pipe(
      map((response) => {
        if (response && response.premium) {
          return true;
        } else {
          this.router.navigate(['/personalInfo-free', userId]);
          return false;
        }
      }),
      catchError((error) => {
        console.error('Erreur lors de la vérification de la prime :', error);
        this.router.navigate(['/accueil']);
        return of(false);
      })
    );
  }
}
