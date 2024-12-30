import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { io } from 'socket.io-client';
import { ChatService } from 'src/app/core/_services/chat.service';
import { KissService } from 'src/app/core/_services/kiss.service';
import { NotificationService } from 'src/app/core/_services/shared/notification.service';
import { UserStatusService } from 'src/app/core/_services/shared/user-status.service';
import { UserService } from 'src/app/core/_services/shared/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss', '../../../assets/css/globale.css'],
})
export class InboxComponent implements OnInit, AfterViewInit {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  private socket: any;
  public messageText: string = '';
  public conversations: any[] = [];
  senderId: any;
  loggedInUserId: any;
  imgPath: string = environment.imgPath;
  profileImage!: string;
  public sender!: any;
  send: boolean = false;
  echec: boolean = false;
  dataLoad: boolean = false;
  showMsg: boolean = false;
  newMessageCount: number = 0;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isImageSelected = false;
  selectedImageUrls: string[] = [];
  default = environment.defaultImage;
  defaultMsgImg = environment.defaultMsgImg;
  isCurrentUserOnline: boolean = false;
  file: File[] = [];
  selectedFile: File[] = [];
  reply: boolean = true;
  role!: string;
  profil!: string;
  loggedInUserPseudo: any;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private kissService: KissService,
    private chatService: ChatService,
    private notificationService: NotificationService,
    private userStatusService: UserStatusService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.senderId = this.route.snapshot.params['id'];
    this.socket = io(environment.nodeUrl);
    this.socket.emit('userConnected', localStorage.getItem('id'));
    this.socket.on('chat message', (message: any) => {
      if (
        (message.to_id == this.senderId &&
          message.from_id == this.loggedInUserId) ||
        (message.from_id == this.senderId &&
          message.to_id == this.loggedInUserId)
      ) {
        // console.log('un message reçu', message);
        this.conversations.push(message);
        // this.markAllSeen(this.senderId);
        this.getMessage();
        this.scrollToBottom();
      }
    });
    setTimeout(() => {
      this.scrollToBottom();
    }, 2000);

    this.userStatusService.usersOnline$.subscribe((usersOnline) => {
      const userIDActuel = '0980e32a-f1a4-4577-97fd-696ec146f91c';

      this.isCurrentUserOnline = usersOnline.includes(this.senderId);
    });
  }

  ngOnInit(): void {
    this.getMessage();
    this.loggedInUserId = localStorage.getItem('id');
    this.loggedInUserPseudo = localStorage.getItem('pseudo');
    const PImage = localStorage.getItem('pImage');
    if (PImage !== null) {
      this.profileImage = this.getImageProfil(PImage);
    }
    this.markAllSeen(this.senderId);

    this.getUserConnected();
  }
  getImageProfil(image: string) {
    if (image) {
      const imagePath = image.replace('users_images/', '');
      return `${this.imgPath}${imagePath}`;
    } else {
      return '';
    }
  }
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  goback() {
    history.back();
    // this.router.navigate(['/chat']);
  }
  formatDate(date: string): string {
    return moment(date).format('ddd D MMM YYYY à HH:mm');
  }
  getMessage() {
    this.scrollToBottom();
    this.chatService.getAllConversation(this.senderId).subscribe(
      (response) => {
        // console.log('ressss', response);
        this.conversations = response.conversations;
        this.reply = response.reply;
        // console.log('reply', this.reply);
        this.conversations.forEach((msg) => {
          msg.send = true;
        });
        this.dataLoad = true;
        this.sender = response.sender;
        // console.log(response.conversations);
        // console.log('sender', this.sender);
        this.conversations = response.conversations;
      },
      (error) => {
        console.error(error);
        this.sender = error.sender;
      }
    );
  }
  getImage(image: string) {
    if (image) {
      const imagePath = image.replace('users_images/', '');
      return `${this.imgPath}${imagePath}`;
    } else {
      // Gérer le cas où l'image est null
      return ''; // ou une autre valeur par défaut
    }
  }
  sendAttachment() {
    this.send = false;
    this.dataLoad = false;
    this.scrollToBottom();
    const inputElement: HTMLInputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.multiple = true; // Permet la sélection multiple
    inputElement.click();

    inputElement.addEventListener('change', (event: any) => {
      const files = event.target.files;

      if (files && files.length > 0) {
        // this.selectedImageUrls = []; // Réinitialise le tableau des URL d'images sélectionnées
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.isImageSelected = true; // Indique qu'une image a été sélectionnée
            this.selectedImageUrls.push(e.target.result);
            // Ajoutez le fichier individuel à selectedImage (et non le FileList complet)
            // this.file.push(files[i]);
            this.file = files[i];

            // console.log('selected image avant sendMessage', this.file);
            this.sendMessage();
          };
          reader.readAsDataURL(files[i]);
          // this.file.forEach((elem: any) => {
          // console.log('selected image avant sendMessage', elem);
          //   // this.sendMessage();
          // });
        }
      }
    });
    // this.sendMessageWithImage();
    this.scrollToBottom();
  }
  sendMessage(): void {
    this.showMsg = true;
    // console.log('selected image au debut de sendMessage', this.file);
    this.scrollToBottom();
    let message: any;
    let data: any;
    let data1: any;

    if (this.messageText) {
      message = {
        body: this.messageText,
        created_at: new Date(),
        from_id: this.loggedInUserId,
        to_id: this.senderId,
        attachment: null,
        send: false,
      };
      data = {
        id: this.senderId,
        message: this.messageText,
      };
    } else if (this.file) {
      const formData = new FormData();
      message = {
        body: '',
        created_at: new Date(),
        from_id: this.loggedInUserId,
        to_id: this.senderId,
        attachment: this.file,
        send: false,
      };

      data1 = {
        id: this.senderId,
        file: this.file,
      };
      formData.append('id', data1.id || '');
      formData.append('file', data1.file || '');
      data = formData;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Action Impossible',
        text: 'Message sans contenu !',
      });
    }

    if (message) {
      const messageBody = this.loggedInUserPseudo + ': ' + message.body;
      // console.log('Mon data', data);
      this.socket.emit('chat message', message);
      this.chatService.sendMessage(data).subscribe(
        (response) => {
          // this.ngOnInit();
          if (response.status == 200) {
            // console.log('messages envoyé au serveur', response);
            // this.socket.emit('chat message', message);
            message.send = true;
            this.send = true;
            this.sendNotif(
              this.sender?.fcm_token,
              this.loggedInUserPseudo,
              messageBody
            );
            this.echec = false;
            this.ngOnInit();
          } else if (response.status == 401 && response.type == 'unlock') {
            Swal.fire({
              icon: 'error',
              title: 'Discussion verrouillée',
              text: "Impossible d’envoyer ce message car cette discussion est arrivée à expiration ou n'est pas encore déverouillé.",
              backdrop: 'static',
              showCancelButton: true,
              confirmButtonText: 'Déverouiller Maintenant avec 1 KISS',
              cancelButtonText: 'Plus tard',
            }).then((result) => {
              if (result.isConfirmed) {
                this.kissService.unlockProfile(this.senderId).subscribe(
                  (response) => {
                    Swal.fire({
                      icon: 'success',
                      title: 'Youpii🥳.',
                      text: 'Discussion dévérouillé avec Succès. Vous pouvez échanger en toute séreinité ! ',
                    });
                    this.chatService.sendMessage(data).subscribe((response) => {
                      // console.log(response);
                      message.send = true;
                      this.socket.emit('chat message', message);
                      this.ngOnInit();
                      this.sendNotif(
                        this.sender?.fcm_token,
                        'SHOKII',
                        messageBody
                      );
                      // console.log('messages envoyé au serveur', response),
                      (error: any) => {
                        console.error('error', error);
                      };
                    });
                  },
                  (error) => {
                    console.error('error de deverouillage', error);
                    this.echec = true;
                    Swal.fire({
                      icon: 'error',
                      title: 'Echec dévérouillage profil.',
                      text: error.error.message,
                    });
                  }
                );
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.echec = true;
              }
            });
          } else {
            this.echec = true;
          }
        },
        (error) => {
          console.error('error', error);
        }
      );
      this.messageText = '';
    }
    this.scrollToBottom();
  }
  sendMessageWithImage(): void {
    const message = {
      body: '',
      created_at: new Date(),
      from_id: this.loggedInUserId,
      to_id: this.senderId,
      attachment: this.croppedImage,
      send: false,
    };

    const data = {
      id: this.senderId,
      file: this.croppedImage,
    };
    const formData = new FormData();
    formData.append('id', data.id || '');
    formData.append('file', data.file || '');
  }

  ngOnDestroy(): void {
    //this.socket.off('chat message');
  }

  calculateTextareaRows(): number {
    const lines = this.messageText.split('\n');
    const numberOfLines = lines.length;

    // Limitez le nombre de lignes en fonction de la taille de l'écran
    const maxLines = this.breakpointObserver.isMatched(Breakpoints.Handset)
      ? 3
      : 5;
    return numberOfLines < maxLines ? numberOfLines : maxLines;
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }
  markAllSeen(userId: any) {
    // const user_id = userId ;
    const data = {
      user_id: userId,
    };
    this.chatService.markAllSeen(data).subscribe(
      (response) => {
        // console.log('res allseen', response);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  getUserConnected() {
    // Récupérer l'utilisateur du localStorage
    const userJSON: string | null = localStorage.getItem('user');
    if (userJSON !== null) {
      const user: {
        id: string;
        pseudo: string;
        role_id: string;
        profil_verify_id: string;
      } = JSON.parse(userJSON);
      const id = user.id;
      this.role = user.role_id;
      this.profil = user.profil_verify_id;
    }
  }
  profileLink(memberId: string): string {
    const routePrefix = 'personalInfo-free';
    return `/${routePrefix}/${this.role}/${memberId}/${this.profil}`;
  }

  sendNotif(fcm_token: string, title: string, body: string) {
    this.notificationService.sendNotification(fcm_token, title, body).subscribe(
      (response) => {
        console.log('Notification send', response);
      },
      (error) => {
        console.error('Error sending notification:', error);
      }
    );
  }
}
