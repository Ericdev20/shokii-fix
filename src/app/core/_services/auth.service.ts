import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticated$.asObservable();
  private tokenKey = 'token';
  private apiUrl = environment.apiUrl;
  valide!: boolean;
  email: string = '';
  private VerifyUrl = `${this.apiUrl}/verify/pin`;
  private tokenEndpoint = environment.oauth2Config.tokenEndpoint;
  private clientId = environment.oauth2Config.clientId;
  private clientSecret = environment.oauth2Config.clientSecret;
  private refreshToken = environment.oauth2Config.refreshToken;
  constructor(private http: HttpClient) {
    this.checkAuthentication();
  }

  private checkAuthentication() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.isAuthenticated$.next(true);
    } else {
      this.isAuthenticated$.next(false);
    }
  }
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  checkEmail(email: string): Observable<any> {
    const payload = { email };
    return this.http.post<any>(
      `${this.apiUrl}/check-email-availability`,
      payload
    );
  }

  checkPhone(phone_number: string): Observable<any> {
    const payload = { phone_number };
    return this.http.post<any>(
      `${this.apiUrl}/checkPhoneNumberAvailability`,
      payload
    );
  }
  checkParrain(code: string): Observable<any> {
    const payload = { code };
    return this.http.post<any>(
      `${this.apiUrl}/check-parrain-availability`,
      payload
    );
  }

  checkPseudo(pseudo: string): Observable<any> {
    const payload = { pseudo };
    return this.http.post<any>(
      `${this.apiUrl}/check-pseudo-availability`,
      payload
    );
  }
  public login(phoneNumber: string, password: string) {
    const payload = { phone_number: phoneNumber, password: password };
    return this.http.post(`${this.apiUrl}/login`, payload).pipe(
      tap((response: any) => {
        const token = response.authorisation.token;
        if (token) {
          this.isAuthenticated$.next(true);
          localStorage.setItem(this.tokenKey, token);
        } else {
          this.isAuthenticated$.next(false);
          this.logout();
        }
      })
    );
  }

  public logout(): void {
    this.isAuthenticated$.next(false);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('id');
    localStorage.removeItem('pseudo');
    localStorage.removeItem('user');
    localStorage.removeItem('pImage');
    localStorage.removeItem('msg');
  }

  public isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Méthode pour envoyer une demande de réinitialisation de mot de passe
  forgotPassword(email: string) {
    const payload = { email };
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, payload);
  }
  verifyRegisterMail(email: string) {
    const payload = { email };
    return this.http.post<any>(`${this.apiUrl}/verifyRegisterMail`, payload);
  }
  verifyToken(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/verify-token`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  public verifyPin(token: number, email: any): Observable<any> {
    const requestData = {
      email: email,
      token: token,
    };

    return this.http.post(this.VerifyUrl, requestData);
  }
  changePassword(password: string, password_confirmation: string, email: any) {
    const requestBody = {
      email: email,
      password: password,
      password_confirmation: password_confirmation,
    };
    return this.http.post<any>(`${this.apiUrl}/reset-password`, requestBody);
  }

  // private handleError(error: any): Observable<never> {
  //   console.error('An error occurred', error);
  //   return throwError(error.message || error);
  // }

  // refreshAccessToken(): Observable<string> {
  //   const body = new HttpParams()
  //     .set('refresh_token', this.refreshToken)
  //     .set('refresh_token', this.refreshToken)
  //     .set('grant_type', 'refresh_token');

  //   const headers = new HttpHeaders().set(
  //     'Content-Type',
  //     'application/x-www-form-urlencoded'
  //   );

  //   return this.http
  //     .post<{ access_token: string }>(this.tokenEndpoint, body.toString(), {
  //       headers,
  //     })
  //     .pipe(
  //       map((response) => response.access_token),
  //       catchError(this.handleError)
  //     );
  // }
}
