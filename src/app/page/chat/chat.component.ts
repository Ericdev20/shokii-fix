import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatService } from 'src/app/core/_services/chat.service';
import * as moment from 'moment';
import 'moment/locale/fr';
import { environment } from 'src/environments/environment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UserStatusService } from 'src/app/core/_services/shared/user-status.service';
import { io } from 'socket.io-client';
import { Router } from '@angular/router';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss', '../../../assets/css/globale.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatComponent implements OnInit {
  contacts: any[] = [];
  lastMessage: any;
  imgPath: string = environment.imgPath;
  page: number = 1;
  count: number = 0;
  tableSize: number = 20;
  tableSizes: any = 10;
  isSmallScreen!: boolean;
  troncatureSmallScreen = 10; // Nombre de mots à afficher sur un petit écran
  troncatureMediumScreen = 15; // Nombre de mots à afficher sur un écran moyen
  troncatureLargeScreen = 40;
  user_id: any;
  isCurrentUserOnline: any;
  // isCurrentUserOnline: boolean = false;
  default = environment.defaultImage;
  socket: any;
  total: any = '..';
  send: any;
  noContactsFound: boolean = false;
  message: any = null;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private breakpointObserver: BreakpointObserver,
    private userStatusService: UserStatusService
  ) {
    this.user_id = localStorage.getItem('id');
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
    // this.getContact('true');

    this.userStatusService.usersOnline$.subscribe((usersOnline) => {
      // console.log('Utilisateurs en ligne :', usersOnline);
      const userIDActuel = '0980e32a-f1a4-4577-97fd-696ec146f91c';
      this.isCurrentUserOnline = usersOnline;
      this.contacts.forEach((contact) => {
        contact.status = usersOnline.includes(contact.id);
      });

      //  this.isCurrentUserOnline = usersOnline.includes(userIDActuel) ;
      // console.log('J suis en ligne', this.isCurrentUserOnline);
    });

    this.socket = io(environment.nodeUrl);
    this.socket.on('chat message', (message: any) => {
      if (message.to_id == this.user_id) {
        // console.log('un message reçu', message);
        localStorage.setItem('msg', '1');
        this.getContact(false, 1, 'now');
      }
    });
  }

  ngOnInit(): void {
    localStorage.removeItem('msg');
    this.chatService.getContact().subscribe(
      (res: any) => {
        // Assurez-vous que res.contacts est défini avant d'accéder à sa propriété 'length'
        if (res.contacts) {
          this.total = res.contacts.length;
          this.contacts = res.contacts;

          if (this.contacts.length === 0) this.noContactsFound = true;

          this.contacts.forEach((contact) => {
            contact.status = this.isCurrentUserOnline.includes(contact.id);
          });
        } else {
          // Gérer le cas où res.contacts est undefined
          console.error('La réponse ne contient pas la propriété "contacts"');
        }
      },
      (error) => {
        // Gérer les erreurs de la requête
        if (error.status === 401 && localStorage.getItem('token') !== null) {
          window.location.reload();
          const url = '/chat';

          // this.router
          //   .navigateByUrl('/', { skipLocationChange: true })
          //   .then(() => {
          //     this.router.navigate([`/${url}`]).then(() => {
          //       console.log(`After navigation I am on:${this.router.url}`);
          //     });
          //   });
        }
        console.error(
          "Une erreur s'est produite lors de la récupération des contacts:",
          error
        );
      }
    );
    this.readMsg();
    //  this.getContact();
    // console.log('je suis en ligne now ?',this.getStatus(this.user_id));
    this.requestPermission();
    this.listen();
    this.checkFcmSave();
    this.listen();
  }
  readMsg() {
    localStorage.removeItem('msg');
  }

  getContact(load: any = true, page: any = 1, now: any = '') {
    this.chatService.getContact(load, now).subscribe(
      (res: any) => {
        // console.log('all contacts', res);
        this.total = res.total;
        this.contacts = res.contacts;
        this.contacts.forEach((contact) => {
          contact.status = false;
        });
      },
      (erreur) => {
        console.error(
          'Erreur lors de la récupération des informations  :',
          erreur
        );
      }
    );
  }

  getStatus(user: any) {
    // this.userStatusService.usersOnline$.subscribe((usersOnline) => {
    //   console.log('Utilisateurs en ligne :', usersOnline);
    //   const userIDActuel = '0980e32a-f1a4-4577-97fd-696ec146f91c';
    //   // return usersOnline.includes(user) ;
    //   // console.log('J suis en ligne',this.isCurrentUserOnline)
    // });
  }
  public formatDate(date: string): string {
    moment.locale('fr');
    return moment(date).format('DD MMMM YYYY à HH:mm');
  }

  getImage(image: string) {
    if (image != null) {
      const imagePath = image.replace('users_images/', '');
      return `${this.imgPath}${imagePath}`;
    }
    return '';
  }

  markAllSeen(userId: any) {
    // const user_id = userId ;
    const data = {
      user_id: userId,
    };
    this.chatService.markAllSeen(data).subscribe(
      (response) => {},
      (error) => {
        console.error(error);
      }
    );
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.tableSize = event.target.value;
    // console.log(this.page);
    // this.getContact(true, event);
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }
  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...'; // Tronquer le texte si nécessaire
    }
    return text;
  }
  truncateText2(text: string, maxLength: number): string {
    if (this.isSmallScreen && text.length > maxLength) {
      return text.substring(0, maxLength) + '...'; // Tronquer le texte si nécessaire
    }
    return text;
  }
  truncateText3(text: string): string {
    let troncatureLength = this.isSmallScreen
      ? this.troncatureSmallScreen
      : window.innerWidth < 768
      ? this.troncatureMediumScreen
      : this.troncatureLargeScreen;

    const words = text.split(' ');
    if (words.length > troncatureLength) {
      return words.slice(0, troncatureLength).join(' ') + '...'; // Tronquer le texte si nécessaire
    }
    return text;
  }
  truncateText4(text: string): string {
    let troncatureLength = this.isSmallScreen
      ? this.troncatureSmallScreen
      : window.innerWidth < 768
      ? this.troncatureMediumScreen
      : this.troncatureLargeScreen;

    if (text.length > troncatureLength) {
      return text.slice(0, troncatureLength) + '...'; // Tronquer le texte si nécessaire
    }
    return text;
  }
  requestPermission() {
    const messaging = getMessaging();

    getToken(messaging, { vapidKey: environment.firebaseConfig.vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          console.log('Token:', currentToken);
          this.saveTokenIfChanged(currentToken); // Sauvegarder le token FCM seulement s'il a changé
        } else {
          console.log(
            'No registration token available. Request permission to generate one.'
          );
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
  }

  checkFcmSave() {
    const fcmKey = localStorage.getItem('fcm');

    if (fcmKey === null || fcmKey === undefined) {
      this.requestPermission();
    }
  }

  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message = payload;
      // Vous pouvez ajouter du code pour afficher une notification à l'utilisateur ici
    });
  }

  private saveTokenIfChanged(currentToken: string) {
    const storedToken = localStorage.getItem('fcm');

    if (storedToken !== currentToken) {
      this.saveToken(currentToken);
    }
  }

  private saveToken(currentToken: string) {
    const user_id = localStorage.getItem('id');
    if (!user_id) {
      console.error('User ID not found in local storage.');
      return;
    }

    const data = {
      userId: user_id,
      fcm_token: currentToken,
    };

    this.chatService.saveToken(data).subscribe(
      (response) => {
        console.log('Token saved successfully', response);
        localStorage.setItem('fcm', currentToken); // Sauvegarder le token dans le local storage
      },
      (error) => {
        console.error('Error saving token:', error);
      }
    );
  }

  public formatDateTime(dateTimeStr: string): string {
    const dateMoment = moment(dateTimeStr);
    const formattedDateTime = dateMoment.format('D MMM YYYY HH:mm:ss');
    return formattedDateTime;
  }
}
