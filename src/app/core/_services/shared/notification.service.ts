// notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.nodeUrl}sendNotification`; // URL de votre API REST

  constructor(private http: HttpClient) {}

  sendNotification(
    token: string,
    title: string,
    body: string
  ): Observable<any> {
    const payload = { token, title, body };
    return this.http.post(this.apiUrl, payload);
  }
}
