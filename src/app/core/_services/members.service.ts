import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private apiUrl = environment.apiUrl;
  private authToken: any;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authToken = this.authService.getToken();
  }

  getUserInfo(id: any): Observable<any> {
    const payload = { id };

    if (this.authToken) {
      return this.http.post<any>(`${this.apiUrl}/getUserInfo`, payload, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
    } else {
      return of(null);
    }
  }

  checkPseudo(pseudo: string): Observable<any> {
    const payload = { pseudo };
    return this.http.post<any>(
      `${this.apiUrl}/check-pseudo-availability`,
      payload
    );
  }

  sendRose(data: any): Observable<any> {
    if (this.authToken) {
      return this.http.post<any>(`${this.apiUrl}/sendRose`, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
    } else {
      return of(null);
    }
  }

  signaler(data: any): Observable<any> {
    if (this.authToken) {
      return this.http.post<any>(`${this.apiUrl}/signaler`, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
    } else {
      return of(null);
    }
  }
  checkUnlock(targetUserId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkUnlock1/${targetUserId}`, [], {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
  }
  checkUnlockWhat(targetUserId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/checkUnlockWhat/${targetUserId}`,
      [],
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      }
    );
  }
  unlockProfile(
    targetUserId: string,
    unlockType: any = 'profil'
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/unlockProfile/${targetUserId}/${unlockType}`,
      [],
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      }
    );
  }
  checkUserPremium() {
    return this.http.get<any>(`${this.apiUrl}/checkSubscriptionAndWallet`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
  }
}
