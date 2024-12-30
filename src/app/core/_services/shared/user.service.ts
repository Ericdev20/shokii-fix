import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private authToken: any;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authToken = this.authService.getToken();
  }
  getUser() {
    if (this.authToken) {
      return this.http.get(`${this.apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
    } else {
      return null;
    }
  }

  changePassword(currentPassword: string, newPassword: string) {
    const authToken = this.authService.getToken();
    const requestBody = {
      old_password: currentPassword,
      new_Password: newPassword,
    };

    if (authToken) {
      return this.http.post<any>(`${this.apiUrl}/changePassword`, requestBody, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    } else {
      return null;
    }
  }
  updateProfile(data: any): Observable<any> {
    const authToken = this.authService.getToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${authToken}`
    );

    return this.http.post<any>(`${this.apiUrl}/updateProfil`, data, {
      headers,
    });
  }
  deleteProfile(data: any): Observable<any> {
    const authToken = this.authService.getToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${authToken}`
    );

    return this.http.post<any>(`${this.apiUrl}/deleteProfil`, data, {
      headers,
    });
  }

  updateProfilePhoto(photo: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('photoProfil', photo, photo.name);
    if (this.authToken) {
      return this.http.post<any>(`${this.apiUrl}/updateProfilMedia`, formData, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
    } else {
      return of(null);
    }
  }

  addMediaToGallery(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    if (this.authToken) {
      return this.http.post<any>(`${this.apiUrl}/add_media_gallery`, formData, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
    } else {
      return of(null);
    }
  }

  updateGalleryMedia(photo: File, id: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', photo, photo.name);
    formData.append('id', id || '');
    if (this.authToken) {
      return this.http.post<any>(
        `${this.apiUrl}/updateGallerieMedias`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );
    } else {
      return of(null);
    }
  }
  removeImage(id: number | null): Observable<any> {
    const payload = { id: id };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`,
    });

    return this.http.post(`${this.apiUrl}/removeImage`, payload, { headers });
  }
}
