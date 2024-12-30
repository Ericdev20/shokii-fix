import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = environment.apiUrl;
  private SendUrl = `${this.apiUrl}/sendOtp`;
  private VerifyUrl = `${this.apiUrl}/verifyOtp`;

  constructor(private http: HttpClient) {}

  sendOtp(phoneNumber: string) {
    const payload = { phone_number: phoneNumber };
    return this.http.post(this.SendUrl, payload);
  }

  public verifyOtp(
    verification_code: number,
    phoneNumber: string
  ): Observable<any> {
    const requestData = {
      verification_code: verification_code,
      phone_number: phoneNumber,
    };

    return this.http.post(this.VerifyUrl, requestData);
  }
}
