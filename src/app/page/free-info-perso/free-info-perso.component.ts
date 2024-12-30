import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MembersService } from 'src/app/core/_services/members.service';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';
import { UserStatusService } from 'src/app/core/_services/shared/user-status.service';
import { HomeService } from 'src/app/core/_services/home.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-free-info-perso',
  templateUrl: './free-info-perso.component.html',
  styleUrls: [
    './free-info-perso.component.scss',
    '../../../assets/css/globale.css',
  ],
  providers: [MessageService],
  // encapsulation: ViewEncapsulation.None,
})
export class FreeInfoPersoComponent implements OnInit {
  @ViewChild('content', { static: true }) contentRef!: ElementRef;
  @ViewChild('contentInfo', { static: true }) contentRef1!: ElementRef;
  @ViewChild('contentWhatsApp', { static: true }) contentRef2!: ElementRef;

  formGroup!: FormGroup;
  id!: any;
  public userInfo: any;
  profileImage!: string;
  imgPath: string = environment.imgPath;
  galleries: any;
  isCurrentUserOnline: boolean = false;
  socket: any;
  premium: boolean = false;
  userSubscrip: boolean = false;
  role: any;
  profil: any;
  unlockX: boolean = false;
  user!: any;
  hasWhatSapp: boolean = false;
  isWhatSappUnlock: boolean = false;
  hasKiss: boolean = false;
  copy: boolean = false;
  copy1: boolean = false;
  checkLink: any;
  similar_profiles: any;
  default = environment.defaultProfil;
  total_similar: any = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private membersService: MembersService,
    private userStatusService: UserStatusService,
    private modalService: NgbModal,
    private messageService: MessageService,
    private homeService: HomeService
  ) {
    this.id = this.route.snapshot.params['id'];
    this.role = this.route.snapshot.params['role'];
    this.profil = this.route.snapshot.params['profil'];

    this.socket = io(environment.nodeUrl);

    this.userStatusService.usersOnline$.subscribe((usersOnline) => {
      const userIDActuel = '0980e32a-f1a4-4577-97fd-696ec146f91c';

      // this.isCurrentUserOnline = usersOnline ;
      this.isCurrentUserOnline = usersOnline.includes(this.id);
    });
  }

  async ngOnInit(): Promise<void> {
    this.getMemberInfo();
    if (this.role == 2) {
      await this.checkPremium();
      // this.checkUnlock();
    } else if (this.role == 3) {
      this.premium = true;
      this.userSubscrip = true;
      if (this.profil == 1 || this.profil == 2) {
        this.unlockX = true;
        const myid = localStorage.getItem('id');
        this.checkLink = 'https://verification.shokii.com?id=' + myid;
        this.openModal(this.contentRef);
      } else if (this.profil == 3) {
        this.router.navigate([
          'personalInfo-premium',
          this.role,
          this.id,
          this.profil,
        ]);
      } else {
        this.closePopup();
        // this.router.navigate(['accueil']);
      }
    } else {
      this.closePopup();
      this.router.navigate(['accueil']);
    }
    // console.log('this.role', this.role);
    // this.openModal(this.contentRef);
    this.formGroup = new FormGroup({
      value: new FormControl(4),
    });
    this.checkUnlockWhat();
  }
  // this.modalService
  //   .open(content, {
  //     ariaLabelledBy: 'modal-basic-title',
  //     size: 'lg',
  //     windowClass: 'custom-class',
  //   })
  //   .result.then((result) => {
  //     // write your code here
  //   });
  openModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-title',
      // size: 'sm',
      windowClass: 'my-class',
      centered: true,
      backdrop: 'static',
    });
  }
  getMemberInfo() {
    this.membersService.getUserInfo(this.id)?.subscribe(
      (res: any) => {
        this.userInfo = res.user;
        this.similar_profiles = res.similar_profiles.data;
        this.total_similar = res.similar_profiles.total;
        const photoProfil = this.userInfo?.profil_pic;
        this.profileImage = this.getImageProfil(photoProfil);
        this.galleries = [];

        if (this.userInfo?.galerie) {
          this.userInfo.galerie.forEach((imageName: string) => {
            // Récupérez le chemin de l'image avec la fonction getImageProfil
            const imagePath: string = this.getImageProfil(imageName);
            const imageObject = {
              image: imagePath,
              thumbImage: imagePath,
            };
            this.galleries.push(imageObject);
          });
        }
      },

      (erreur) => {
        Swal.fire({
          icon: 'error',
          title: 'Accès Réfusé',
          text: 'Cette Page est inaccessible .',
        }).then(() => {
          this.closePopup();
          this.router.navigate(['accueil']);
        });

        console.error(
          "Erreur lors de la récupération des informations de l'utilisateur :",
          erreur
        );
      }
    );
  }
  closePopup() {
    this.modalService.dismissAll();
  }
  generateProfileLink(memberId: string): string {
    const routePrefix = this.premium
      ? 'personalInfo-premium'
      : 'personalInfo-free';
    return `/${routePrefix}/${this.role}/${memberId}/${this.profil}`;
  }
  checkPremium() {
    this.homeService.checkUserPremium().subscribe(
      (res: any) => {
        this.premium = res.premium;
        // this.hasKiss = res.kiss;
        this.checkUnlock();

        // this.premium || this.hasKiss
        //   ? this.router.navigate([
        //       'personalInfo-premium',
        //       this.role,
        //       this.id,
        //       this.profil,
        //     ])
        //   : this.openModal(this.contentRef);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Page inaccessible ...',
        }).then(() => {
          history.back();
        });
        console.error(
          'Erreur lors de la récupération des informations  :',
          error
        );
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
  // buyKiss() {
  //   this.router.navigate(['checkout']);
  //   // window.location.href = '/checkout';
  // }
  // subscribe() {
  //   this.router.navigate(['abonnement']);
  //   // window.location.href = '/abonnement';
  // }
  buyKiss() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['checkout'])
    );
    window.open(url, '_blank');
  }

  subscribe() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['abonnement'])
    );
    window.open(url, '_blank');
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
              this.isWhatSappUnlock = true;
              Swal.fire({
                icon: 'success',
                title: 'WhatsApp dévérouillé avec Succès .',
                text: "WhatsApp dévérouillé avec Succès. Veuillez cliquer sur l'icone whatsApp pour être rédiriger ou copier le numéro cet utilisateur .'",
              }).then(() => {
                // window.location.reload();
                // this.ngOnInit();
                this.openModal(this.contentRef2);

                this.getMemberInfo();
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
      if (this.role == 2) {
        Swal.fire({
          icon: 'error',
          title: 'Messagerie non déveroullé ...',
          showCancelButton: true,
          confirmButtonText: 'Dévérouillez maintenant',
          cancelButtonText: 'Plus tard',
          html:
            'Il vous faut <b style="color:green">1 kiss</b> pour débloquer la messagerie privée de <b>' +
            user +
            '</b>',
          footer:
            '<a href="/abonnement">Vous pouvez vous approvisionner ici </a>',
        }).then((result) => {
          if (result.isConfirmed) {
            /*  this.membersService.unlockProfile(this.id).subscribe(
              (res: any) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Profil dévérouillé avec Succès .',
                  text: "Profil dévérouillé avec Succès. Vous avez désormais accès à ce profil et aussi aussi la possibilité d'échanger en toute séreinité !🥳",
                }).then(() => {
                  window.location.reload();
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
                  title: 'Echec dévérouillage Profil.',
                  text: error.error.message,
                });
              }
            );*/
            this.unlock();
            // this.membersService.unlockProfile(this.id).subscribe(
            //   (res: any) => {
            //     Swal.fire({
            //       icon: 'success',
            //       title: 'Profil dévérouillé avec Succès .',
            //       text: "Profil dévérouillé avec Succès. Vous avez désormais accès à ce profil et aussi aussi la possibilité d'échanger en toute séreinité !🥳",
            //     }).then(() => {
            //       window.location.reload();
            //     });
            //   },
            //   (error: any) => {
            //     console.error('Erreur lors du déverrouillage du profil', error);
            //     if (error instanceof HttpErrorResponse) {
            //       if (error.status === 401) {
            //         // Traiter l'erreur spécifique ici (par exemple, utilisateur non autorisé)
            //         console.error('Erreur 401: Non autorisé');
            //       } else if (error.status === 403) {
            //         // Traiter l'erreur spécifique ici (par exemple, accès interdit)
            //         console.error('Erreur 403: Accès interdit');
            //       }
            //       // ... Ajoutez d'autres conditions en fonction de votre API
            //     }
            //     Swal.fire({
            //       icon: 'error',
            //       title: 'Echec dévérouillage du profil.',
            //       text:
            //         error.error.message || "Une erreur inconnue s'est produite.",
            //     });
            //   }
            // );
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // L'utilisateur a cliqué sur "Plus tard"
            // Ajoutez ici le code à exécuter lorsque l'utilisateur clique sur "Plus tard"
            // this.router.navigate(['login']);
          }
        });
      } else if (this.role == 3) {
        Swal.fire({
          icon: 'error',
          title: 'Profil non vérifié ...',
          showCancelButton: true,
          confirmButtonText: 'Passer la vérification maintenant',
          cancelButtonText: 'Plus tard',
          html:
            'Vous ne pouvez pas contacter <b>' +
            user +
            '</b> sans avoir vérifier votre compte . ',
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(this.checkLink);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // L'utilisateur a cliqué sur "Plus tard"
            // Ajoutez ici le code à exécuter lorsque l'utilisateur clique sur "Plus tard"
            // this.router.navigate(['login']);
          }
        });
      }
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
  checkUnlockWhat() {
    this.membersService.checkUnlockWhat(this.id).subscribe(
      (res: any) => {
        this.hasWhatSapp = res.whatsapp_allowed;
        this.isWhatSappUnlock = res.whatsapp;
      },
      (error) => {
        console.error('Erreur lors de la verification :', error);
      }
    );
  }

  checkUnlock() {
    this.membersService.checkUnlock(this.id).subscribe(
      (res: any) => {
        this.userSubscrip = res.msg;
        // this.checkPremium();
        this.userSubscrip
          ? this.router.navigate([
              'personalInfo-premium',
              this.role,
              this.id,
              this.profil,
            ])
          : this.openModal(this.contentRef);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Page inaccessible ...',
        }).then(() => {
          this.closePopup();
          this.router.navigate(['accueil']);
        });
        console.error(
          'Erreur lors de la récupération des informations  :',
          error
        );
      }
    );
  }
  unlock() {
    Swal.fire({
      icon: 'question',
      title: 'Êtes-vous sûr(e) de vouloir déverrouiller ce profil ?',
      text: 'Ceci vous coûtera 1 KISS !',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, déverrouiller !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        // Si l'utilisateur clique sur "Oui, déverrouiller !"
        this.membersService.unlockProfile(this.id).subscribe(
          (res: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Profil déverrouillé avec succès.',
              text: 'Vous pouvez désormais échanger en toute sérénité pour 7 jours ! 🥳',
            }).then(() => {
              this.closePopup();
              // this.router.navigate([
              //   'personalInfo-premium',
              //   this.role,
              //   this.id,
              //   this.profil,
              // ]);
              window.location.reload();
            }); // Ajout de la parenthèse fermante ici
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur lors du déverrouillage du profil',
              text: error.error.message,
              footer:
                '<a  href="/abonnement">Vous pouvez vous approvisionner ici </a>',
            }).then(() => {
              this.closePopup();
              // this.router.navigate(['accueil']);
            });
            console.error(
              'Erreur lors de la récupération des informations :',
              error
            );
          }
        );
      }
    });
  }

  VerifyAccount() {
    this.closePopup();
    this.openModal(this.contentRef1);
  }
  agree() {
    this.user = localStorage.getItem('id');
    this.closePopup();
    window.close();
    window.open('https://verification.shokii.com/?id=' + this.user, '_blank');
  }
  onCopySuccess(): void {
    this.copy = true;
    this.messageService.add({
      severity: 'info',
      summary: '',
      detail: 'Numéro copié',
    });
  }
  onCopySuccess1(): void {
    this.copy1 = true;
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
}
