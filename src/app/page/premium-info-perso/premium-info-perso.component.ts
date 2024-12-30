import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MembersService } from 'src/app/core/_services/members.service';
import { UserService } from 'src/app/core/_services/shared/user.service';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { data } from 'jquery';
import Swal from 'sweetalert2';
import { Message, MessageService } from 'primeng/api';
import { ClipboardService } from 'ngx-clipboard';
import { ChatService } from 'src/app/core/_services/chat.service';
import { UtilitiesService } from 'src/app/core/_services/utilities.service';
import { io } from 'socket.io-client';
import { UserStatusService } from 'src/app/core/_services/shared/user-status.service';
import { HomeService } from 'src/app/core/_services/home.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/core/_services/shared/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-premium-info-perso',
  templateUrl: './premium-info-perso.component.html',
  styleUrls: [
    './premium-info-perso.component.scss',
    '../../../assets/css/globale.css',
  ],
  providers: [MessageService],
})
export class PremiumInfoPersoComponent implements OnInit {
  @ViewChild('contentWhatsApp', { static: true }) contentRef2!: ElementRef;

  formGroup!: FormGroup;
  filledStarsArray: any[] = [];
  emptyStarsArray: any[] = [];
  halfStar: number = 0;
  id!: any;
  public userInfo: any;
  profileImage!: string;
  imgPath: string = environment.imgPath;
  galleries: any = [];
  rate: any;
  message: any;
  generatedMessage: string | null = null;
  pseudo: string | null = null;
  isCurrentUserOnline: boolean = false;
  socket: any;
  default = environment.defaultImage;
  premium: boolean = false;
  profil: any;
  role: any;
  userSubscrip: boolean = false;
  hasWhatSapp: boolean = false;
  isWhatSappUnlock: boolean = false;
  imageObject!: (
    | { image: string; thumbImage: string; title: string }
    | { image: string; thumbImage: string; title?: undefined }
  )[];
  myId!: any;
  fcm: any;
  loggedInUserPseudo: string | null;
  similar_profiles: any;
  total_similar: any = 0;
  copy: boolean = false;
  copy1: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private membersService: MembersService,
    private messageService: MessageService,
    private clipboardService: ClipboardService,
    private userStatusService: UserStatusService,
    private notificationService: NotificationService,
    private modalService: NgbModal,
    private utilitiesService: UtilitiesService,
    private homeService: HomeService
  ) {
    this.id = this.route.snapshot.params['id'];
    this.role = this.route.snapshot.params['role'];
    this.profil = this.route.snapshot.params['profil'];
    this.socket = io(environment.nodeUrl);
    this.myId = localStorage.getItem('id');
    this.loggedInUserPseudo = localStorage.getItem('pseudo');

    this.userStatusService.usersOnline$.subscribe((usersOnline) => {
      // console.log('Utilisateurs en ligne :', usersOnline);

      const userIDActuel = '0980e32a-f1a4-4577-97fd-696ec146f91c';

      // this.isCurrentUserOnline = usersOnline ;

      this.isCurrentUserOnline = usersOnline.includes(this.id);
      // console.log('Il est en ligne', this.isCurrentUserOnline);
    });
  }

  ngOnInit(): void {
    this.membersService.checkUnlock(this.id).subscribe(
      async (res: any) => {
        this.userSubscrip = res.msg;
        console.log('checkUnlock', this.userSubscrip);
        if (!this.userSubscrip) {
          this.router.navigate([
            'personalInfo-free',
            this.role,
            this.id,
            this.profil,
          ]);
        } else {
          this.membersService.getUserInfo(this.id)?.subscribe(
            (res: any) => {
              this.userInfo = res.user;

              this.similar_profiles = res.similar_profiles.data;
              this.total_similar = res.similar_profiles.total;
              this.pseudo = this.userInfo.pseudo;
              this.rate = res.average_received_roses;
              this.fcm = res.fcm_token;
              this.updateStars(this.rate);
              const photoProfil = this.userInfo?.profil_pic;

              this.profileImage = this.getImageProfil(photoProfil);
              // this.galleries = this.userInfo?.galerie;

              this.userInfo?.galerie.forEach((imageName: string) => {
                // Récupérez le chemin de l'image avec la fonct ion getImageProfil
                const imagePath: string = this.getImageProfil(imageName);
                const imageObject: {
                  image: string;
                  thumbImage: string;
                  title?: string;
                } = {
                  image: imagePath,
                  thumbImage: imagePath,
                };
                this.galleries.push(imageObject);
              });

              // //gestion des images galleries

              // const galleries = this.userInfo.images.filter(
              //   (image: any) => image.type === 'gallerieProfil'
              // );

              // if (galleries) {
              //   this.galleries = galleries.map((image: any) => ({
              //     imageUrl: this.getImageProfil(image.path),
              //   }));
              // } else {
              // }
            },

            (erreur) => {
              console.error(
                "Erreur lors de la récupération des informations de l'utilisateur :",
                erreur
              );
            }
          );

          //get message
          if (this.role == 3) await this.getMsgGen();
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Page inaccessible ...',
        }).then(() => {
          this.router.navigate([
            'personalInfo-free',
            this.role,
            this.id,
            this.profil,
          ]);
        });
        console.error(
          'Erreur lors de la récupération des informations  :',
          error
        );
      }
    );
    this.checkUnlockWhat();

    this.formGroup = new FormGroup({
      value: new FormControl(0),
    });
  }
  getMsgGen() {
    this.utilitiesService.getGenerateMsg()?.subscribe(
      (res: any) => {
        this.message = res;
        // console.log('message', this.message);
      },
      (erreur) => {
        console.error('Erreur lors de la récupération des message:', erreur);
      }
    );
  }
  checkUnlockWhat() {
    this.membersService.checkUnlockWhat(this.id).subscribe(
      (res: any) => {
        // console.log('res', res);
        this.hasWhatSapp = res.whatsapp_allowed;
        this.isWhatSappUnlock = res.whatsapp;
      },
      (error) => {
        console.error('Erreur lors de la verification :', error);
      }
    );
  }
  calculateAge(dateOfBirth: string): number {
    const now = moment();
    const birthDate = moment(dateOfBirth, 'YYYY-MM-DD');
    return now.diff(birthDate, 'years');
  }
  getImageProfil(image: string) {
    if (image) {
      const imagePath = image.replace('users_images/', '');
      return `${this.imgPath}${imagePath}`;
    } else {
      return '';
    }
  }

  submitRating() {
    const ratingValue = this.formGroup.get('value')?.value;
    const data = {
      recipientId: this.id,
      nombreRose: ratingValue,
    };
    this.membersService.sendRose(data).subscribe(
      (response) => {
        // console.log('resultat de la notation', response);
        this.ngOnInit();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Notation soumis avec succès ...',
        });
      },
      (error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la notation .',
        });
      }
    );
  }
  generateProfileLink(memberId: string): string {
    const routePrefix = this.premium
      ? 'personalInfo-premium'
      : 'personalInfo-free';
    return `/${routePrefix}/${this.role}/${memberId}/${this.profil}`;
  }

  updateStars(note: number): void {
    const totalStars = 5;
    const filledStars = Math.floor(note);
    this.halfStar = note % 1 >= 0.5 ? 1 : 0; // Stockage de la valeur de halfStar
    const emptyStars = totalStars - filledStars - this.halfStar;
    this.filledStarsArray = new Array(filledStars);
    this.emptyStarsArray = new Array(emptyStars);
  }

  async signaler() {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Signaler un utilisateur',
      inputPlaceholder: 'Motif du signalement ici...',
      inputAttributes: {
        'aria-label': 'Entrez votre message',
      },
      showCancelButton: true,
      confirmButtonText: 'Envoyer',
      cancelButtonText: 'Annuler',
    });

    if (text) {
      const data = {
        reported_id: this.id,
        reason: text,
      };
      this.membersService.signaler(data).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Signalement réussi',
            detail:
              ' Nous examinerons votre plainte dans les plus brefs délais.',
          });
        },
        (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: "Une erreur est survenue lors de l'envoie du plainte .",
          });
        }
      );
    }
  }
  onCopySuccess1(): void {
    this.copy1 = true;
    this.messageService.add({
      severity: 'info',
      summary: '',
      detail: 'Numéro copié',
    });
  }
  onCopySuccess(): void {
    this.copy = true;
    this.messageService.add({
      severity: 'info',
      summary: '',
      detail: 'Numéro copié',
    });
  }

  onCopyError(): void {
    this.messageService.add({
      severity: 'error',
      summary: '',
      detail: 'Echec de copie',
    });
  }

  generateMessage() {
    const randomIndex = Math.floor(Math.random() * this.message.length);
    this.generatedMessage = this.message[randomIndex].content;
  }

  sendMessage() {
    const data = {
      id: this.id,
      message: this.generatedMessage,
    };
    const message = {
      body: this.generatedMessage,
      created_at: new Date(),
      from_id: this.myId,
      to_id: this.id,
      attachment: null,
      send: false,
    };
    const messageBody = this.loggedInUserPseudo + ': ' + message.body;
    this.chatService.sendMessage(data).subscribe(
      (response) => {
        // console.log('messages envoyé au serveur', response);

        if (response.status === '200') {
          Swal.fire({
            icon: 'success',
            title: 'Envoyé.',
            text: 'Message envoyé avec succès .',
          });
          message.send = true;
          this.socket.emit('chat message', message);
          this.sendNotif(this.fcm, 'SHOKII', messageBody);
        }
      },
      (error) => {
        console.error('error', error);
      }
    );
  }

  swalinfo(obj: any, user: any) {
    if (obj === 'what') {
      Swal.fire({
        icon: 'error',
        title: 'WhatsApp non déveroullé ...',
        html:
          'Il vous faut <b style="color:red">2 kiss </b> pour joindre <b>' +
          user +
          '</b> sur son WhatsApp privé.',
        showCancelButton: true,
        confirmButtonText: 'Dévérouillez maintenant',
        cancelButtonText: 'Plus tard',
        footer:
          '<a  href="/abonnement">Vous pouvez vous approvisionner ici </a>',
      }).then((result) => {
        if (result.isConfirmed) {
          this.membersService.unlockProfile(this.id, 'whatsapp').subscribe(
            (res: any) => {
              // console.log('unlockProfile', res);
              this.isWhatSappUnlock = true;

              Swal.fire({
                icon: 'success',
                title: 'WhatsApp dévérouillé avec Succès .',
                text: "WhatsApp dévérouillé avec Succès. Veuillez cliquer sur l'icone whatsApp pour être rédiriger ou copier le numéro cet utilisateur .'",
              }).then(() => {
                this.openModal(this.contentRef2);
              });
            },
            (error: any) => {
              console.error('error de déverouillage', error);
              if (error instanceof HttpErrorResponse) {
                if (error.status === 400) {
                  // Traiter l'erreur spécifique ici
                  console.error('Erreur 400: Mauvaise demande');
                } else if (error.status === 401) {
                  // Traiter l'erreur spécifique ici
                  console.error('Erreur 401: Non autorisé');
                }
                // ...
              }
              Swal.fire({
                icon: 'error',
                title: 'Echec dévérouillage whatsApp.',
                text: error.error.message,
              });
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // L'utilisateur a cliqué sur "Plus tard"
          // Ajoutez ici le code à exécuter lorsque l'utilisateur clique sur "Plus tard"
          // this.router.navigate(['login']);
        }
      });
    } else if (obj === 'chat') {
      Swal.fire({
        icon: 'error',
        title: 'Messagerie non déveroullé ...',
        html:
          'Il vous faut 1 kiss pour débloquer la messagerie privée de <b>' +
          user +
          '</b>',
        footer:
          '<a href="/abonnement">Vous pouvez vous approvisionner ici </a>',
      }).then((result) => {
        if (result.isConfirmed) {
          this.membersService.unlockProfile(this.id).subscribe(
            (res: any) => {
              // console.log('unlockProfile', res);
              Swal.fire({
                icon: 'success',
                title: 'Profil dévérouillé avec Succès .',
                text: "Profil dévérouillé avec Succès. Vous avez désormais accès à ce profil et aussi aussi la possibilité d'échanger en toute séreinité !🥳",
              }).then(() => {
                window.location.reload();
              });
            },
            (error: any) => {
              console.error('Erreur lors du déverrouillage du profil', error);
              if (error instanceof HttpErrorResponse) {
                if (error.status === 401) {
                  // Traiter l'erreur spécifique ici (par exemple, utilisateur non autorisé)
                  console.error('Erreur 401: Non autorisé');
                } else if (error.status === 403) {
                  // Traiter l'erreur spécifique ici (par exemple, accès interdit)
                  console.error('Erreur 403: Accès interdit');
                }
                // ... Ajoutez d'autres conditions en fonction de votre API
              }

              Swal.fire({
                icon: 'error',
                title: 'Echec dévérouillage du profil.',
                text:
                  error.error.message || "Une erreur inconnue s'est produite.",
              });
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // L'utilisateur a cliqué sur "Plus tard"
          // Ajoutez ici le code à exécuter lorsque l'utilisateur clique sur "Plus tard"
          // this.router.navigate(['login']);
        }
      });
    } else if (obj === 'noWhat') {
      Swal.fire({
        icon: 'info',
        title: 'WhatsApp non disponible ',
        text: "Cet Utilsateur n'a pas un compte whatsApp enregistré . Veuillez le joindre dans sa messagerie privé .",
        showCancelButton: true,
        confirmButtonText: 'Continue vers sa messagerie',
        cancelButtonText: 'Plus tard',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['inbox', this.id]);
          // this.router.navigate(['accueil']);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // L'utilisateur a cliqué sur "Plus tard"
        }
      });
    }
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
  closePopup() {
    this.modalService.dismissAll();
    this.ngOnInit();
  }
  openModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-title',
      // size: 'sm',
      windowClass: 'my-class',
      centered: true,
      backdrop: 'static',
    });
  }
}
