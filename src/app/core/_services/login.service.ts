import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/api/login';

  constructor(private http: HttpClient) {}

  connexion(phoneNumber: string, password: string) {
    const payload = { phone_number: phoneNumber, password: password };
    return this.http.post(this.apiUrl, payload);
  }
}
