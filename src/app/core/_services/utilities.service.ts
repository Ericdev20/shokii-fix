import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  private apiUrl = environment.apiUrl;
  authToken: string | null;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authToken = this.authService.getToken();
  }

  getAllFaq(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/allpublications`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
  }
  getAllReviews(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAllReview`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
  }

  getGenerateMsg(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/messageGenerate`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
  }
  welcomeText(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/textesAccueil`);
  }
  textesDescription(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/textesDescription`);
  }

  submitContact(contactData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sendcontact`, contactData, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
  }
}
