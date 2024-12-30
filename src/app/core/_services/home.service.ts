import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = environment.apiUrl;
  authToken: string | null;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authToken = this.authService.getToken();
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
  }

  checkUserPremium() {
    return this.http.get<any>(`${this.apiUrl}/checkSubscriptionAndWallet`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
  }
}
