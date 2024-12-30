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
export class ChatService {
  private socket!: Socket;
  private url = environment.nodeUrl;
  private apiUrl = environment.apiUrl;
  authToken!: string | null;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authToken = this.authService.getToken();
    this.socket = io(this.url);
  }

  sendMessage(data: any): Observable<any> {
    this.socket.emit('message', data);
    if (this.authToken) {
      return this.http.post<any>(`${this.apiUrl}/send`, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
    } else {
      return of(null);
    }
  }

  fetchMsg(id: any) {
    const payload = { id };
    if (this.authToken) {
      return this.http.post<any>(`${this.apiUrl}/fetch`, payload, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
    } else {
      return of(null);
    }
  }

  // getAllConversation(user_id: any) {
  //   const payload = { user_id };
  //   if (this.authToken) {
  //     return this.http.post<any>(`${this.apiUrl}/getAllConversation`, payload, {
  //       headers: {
  //         Authorization: `Bearer ${this.authToken}`,
  //       },
  //     });
  //   } else {
  //     return of(null);
  //   }
  // }
  getAllConversation(user_id: any, showLoader: boolean = false) {
    const payload = { user_id };
    if (this.authToken) {
      const headers = {
        Authorization: `Bearer ${this.authToken}`,
        NoLoaderRequest: showLoader ? 'true' : 'false',
      };

      return this.http.post<any>(`${this.apiUrl}/getAllConversation`, payload, {
        headers,
      });
    } else {
      return of(null);
    }
  }

  getLastConversation(user_id: any) {
    const payload = { user_id };
    if (this.authToken) {
      return this.http.post<any>(
        `${this.apiUrl}/getLastConversation`,
        payload,
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
  // getContact(showLoader: boolean = true): Observable<any> {
  //   const headers = {
  //     Authorization: `Bearer ${this.authToken}`,
  //     NoLoaderRequest: showLoader ? 'false' : 'true',
  //   };

  //   return this.http.get(`${this.apiUrl}/getContacts`, { headers });
  // }
  getContact(showLoader: boolean = true, page: any = 1): Observable<any> {
    const payload = { page: page };
    const headers = {
      Authorization: `Bearer ${this.authToken}`,
      NoLoaderRequest: showLoader ? 'false' : 'true',
    };

    return this.http.post<any>(`${this.apiUrl}/getContacts`, payload, {
      headers: headers,
    });
  }

  countUnseenMsg(): Observable<any> {
    return this.http.get(`${this.apiUrl}/count-unseen-messages`, {
      headers: { Authorization: `Bearer ${this.authToken}` },
    });
  }
  markAllSeen(data: any): Observable<any> {
    if (this.authToken) {
      return this.http.post<any>(`${this.apiUrl}/markAllAsSeen`, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
    } else {
      return of(null);
    }
  }

  checkUnlock(targetUserId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkUnlock/${targetUserId}`, [], {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
  }
  unlockProfile(targetUserId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/unlockProfile/${targetUserId}`, [], {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
  }
  saveToken(data: any): Observable<any> {
    const payload = data;
    return this.http.post(`${this.apiUrl}/updateFcmToken/`, payload, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
  }
}
