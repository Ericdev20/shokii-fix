import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UserStatusService {
  private usersOnlineSubject: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  usersOnline$: Observable<string[]> = this.usersOnlineSubject.asObservable();
  user_id: any;

  constructor(private socket: Socket, private userService: UserService) {
    this.socket.on('onlineUsers', (onlineUsers: string[]) => {
      // console.log('Utilisateurs en ligne : depuis le srvice :', onlineUsers);
      this.usersOnlineSubject.next(onlineUsers);
    });

    this.socket.on('disconnected', (userId: string) => {
      // console.log('Utilisateur déconnecté :depuis le srvice  ', userId);
      const currentUsers = this.usersOnlineSubject.value;
      const updatedUsers = currentUsers.filter((id) => id !== userId);
      this.usersOnlineSubject.next(updatedUsers);
    });
    // this.getUser();
  }

  isCurrentUserOnline(userId: string): boolean {
    const usersOnline = this.usersOnlineSubject.value;
    return usersOnline.includes(userId);
  }

  public isUserOnline(userId: string): boolean {
    const usersOnline = this.usersOnlineSubject.value;
    return usersOnline.includes(userId);
  }

  getUser() {
    this.userService.getUser()?.subscribe(
      (res: any) => {
        this.user_id = res.user.id;
        // console.log('lid est =', this.user_id);
        // this.email = res.user.email;
      },
      (erreur) => {
        console.error(
          "Erreur lors de la récupération des informations de l'utilisateur :",
          erreur
        );
      }
    );
  }
}
