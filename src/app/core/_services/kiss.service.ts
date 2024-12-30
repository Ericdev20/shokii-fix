import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class KissService {
  private apiUrl = environment.apiUrl;
  authToken: string | null;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authToken = this.authService.getToken();
  }

  getPackAbonnement(): Observable<any> {
    return this.http.get(`${this.apiUrl}/packAbonnement`, {
      headers: { Authorization: `Bearer ${this.authToken}` },
    });
  }

  getUserTransactions(showLoader: boolean = true): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUserTransactions`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        NoLoaderRequest: showLoader ? 'false' : 'true',
      },
    });
  }

  getAbonnement(id: any): Observable<any> {
    const payload = { id };
    return this.http.post(`${this.apiUrl}/getAbonnement`, payload);
  }
  getWallet(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getWalletInfo`, {
      headers: { Authorization: `Bearer ${this.authToken}` },
    });
  }

  buyKiss(data: any): Observable<any> {
    if (this.authToken) {
      return this.http.post<any>(`${this.apiUrl}/buyKiss`, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
    } else {
      return of(null);
    }
  }

  abonnement(data: any): Observable<any> {
    if (this.authToken) {
      return this.http.post<any>(`${this.apiUrl}/abonnement`, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
    } else {
      return of(null);
    }
  }

  unlockProfile(targetUserId: any, unlockType: any = 'profil') {
    const payload = { targetUserId };
    if (this.authToken) {
      const headers = {
        Authorization: `Bearer ${this.authToken}`,
      };

      return this.http.post<any>(
        `${this.apiUrl}/unlockProfile/${targetUserId}/${unlockType}`,
        null, // Le corps (payload) est null ici, vous pouvez le passer si nécessaire
        { headers: headers }
      );
    } else {
      return of(null);
    }
  }
}
