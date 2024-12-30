import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { HomeService } from 'src/app/core/_services/home.service';
import { UserService } from 'src/app/core/_services/shared/user.service';
import { environment } from 'src/environments/environment';
import { villes } from 'src/app/_utilities/villes-data';
import { UserStatusService } from 'src/app/core/_services/shared/user-status.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { ChatService } from 'src/app/core/_services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../../assets/css/globale.css', './home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  @ViewChild('content', { static: true }) contentRef!: Element;
  userLogged: any;
  name: any = '';
  members: any[] = [];
  profileImage!: any;
  imgPath: string = environment.imgPath;
  profileImageUrls: { [userId: number]: string } = {};
  searchForm!: FormGroup;
  originalMembers: any;
  selectedCorpulence: any;
  selectedProfil: any;
  selectedTeint: string | null = ''; // Valeur par défaut : "Très Claire"
  premium: boolean = false;
  page: number = 1;
  count: number = 0;
  tableSize: number = 20;
  tableSizes: any = [3, 6, 9, 12];
  villes: any;
  selectedAge: number[] = [18, 65];
  minAge = 19;
  maxAge = 65;
  selectedVille: any;
  nombre: number = 5;
  usersOnline: string[] = [];
  ageRange = '';

  filledStarsArray: any[] = [];
  emptyStarsArray: any[] = [];
  halfStar: number = 0;
  role: any;
  isCurrentUserOnline: any;
  searching: boolean = false;
  noUsersFound: boolean = false;
  default = environment.defaultProfil;
  profil: any;
  Onlinestatus: any = '';
  checkLink!: string;
  greetingMessage: string = '';
  message: any = null;
  fcmKey!: string | null;
  recent_users: any[] = [];
  noRecentFound: boolean = false;
  user_id: any = null;
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private homeService: HomeService,
    private userStatusService: UserStatusService,
    private modalService: NgbModal
  ) {
    this.getUserConnected();
    this.greetUser(this.name);

    this.villes = villes;

    this.userStatusService.usersOnline$.subscribe((usersOnline) => {
      // console.log('Utilisateurs en ligne :', usersOnline);

      const userIDActuel = '0980e32a-f1a4-4577-97fd-696ec146f91c';
      this.members.forEach((members) => {
        members.Onlinestatus = usersOnline.includes(members.id);
        this.sortedMembers();
      });
      this.isCurrentUserOnline = usersOnline;
      /* this.homeService.getAllUsers()?.subscribe(
        (res: any) => {
          // console.log('les utilisateurs', res.users);
          this.members = res.users;

          if (this.members.length == 0) this.noUsersFound = true;
          this.members.forEach((user: any) => {
            const photoProfil = user.images.find(
              (image: any) => image.type === 'photoProfil'
            );
            if (photoProfil) {
              user.profileImage = this.getImageProfil(photoProfil.path);
            } else {
              user.profileImage =
                '../../../assets/images/profile/pic-female.jpeg';
            }
            this.members.forEach((members) => {
              members.Onlinestatus = usersOnline.includes(members.id);
            });
            this.originalMembers = this.members;
          });

          // Triez les utilisateurs en fonction de leur note (average_received_roses) et ensuite par profil_verify_id
          this.members.sort((a, b) => {
            if (b.average_received_roses !== a.average_received_roses) {
              return b.average_received_roses - a.average_received_roses;
            }
            return b.profil_verify_id - a.profil_verify_id;
          });
        },
        (erreur) => {
          console.error(
            "Erreur lors de la récupération des informations de l'utilisateur :",
            erreur
          );
        }
      );*/

      //  this.isCurrentUserOnline = usersOnline.includes(userIDActuel) ;
      // console.log('J suis en ligne', this.isCurrentUserOnline);
    });
  }
  ngOnInit(): void {
    this.getAllUserConnected();
    this.userStatusService.usersOnline$.subscribe((usersOnline) => {
      this.usersOnline = usersOnline;
    });
    // console.log('Home page', this.usersOnline);
    this.homeService.checkUserPremium().subscribe(
      (res: any) => {
        // console.log('Premium', res.premium);
        this.premium = res.premium;
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des informations  :',
          error
        );
      }
    );
    this.getUserConnected();

    this.searchForm = new FormGroup({
      searchTerm: new FormControl(''),
    });
    this.checkFcmSave();
    this.listen();
  }

  generateProfileLink(memberId: string): string {
    const routePrefix = this.premium
      ? 'personalInfo-premium'
      : 'personalInfo-free';
    return `/${routePrefix}/${this.role}/${memberId}/${this.profil}`;
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
      this.user_id = user.id;
      this.name = user.pseudo;
      this.role = user.role_id;
      this.profil = user.profil_verify_id;
      this.checkLink = 'https://verification.shokii.com?id=' + id;

      const notifKey = 'newU' + this.user_id;
      const newU = localStorage.getItem(notifKey) || 'false';
      if (newU === '1') {
        this.welcomeModal(this.contentRef);
      }
    }

    // this.userService.getUser()?.subscribe(
    //   (res: any) => {
    //     const user = res.user;
    //     this.role = user.role_id;
    //     this.profil = this.sexe === 2;
    //     this.verify = user.profil_verify_id;
    //     this.user_id = user.role_id;
    //     this.validite = user.wallet?.validite;
    //   },
    //   (erreur) => {
    //     console.error(
    //       "Erreur lors de la récupération des informations de l'utilisateur :",
    //       erreur
    //     );
    //   }
    // );
  }

  calculateAgeRange() {
    this.ageRange = this.minAge + ' - ' + this.maxAge + ' ans';
  }

  formatLabel(value: number): string {
    return Math.round(value) + 'ans';
  }
  getAllUser() {
    this.homeService.getAllUsers()?.subscribe(
      (res: any) => {
        this.members = res.users;
        this.originalMembers = res.users;
        this.members.forEach((user: any) => {
          const photoProfil = user.images.find(
            (image: any) => image.type === 'photoProfil'
          );
          if (photoProfil) {
            user.profileImage = this.getImageProfil(photoProfil.path);
          } else {
            user.profileImage = '../../../assets/images/profile/pic-male.jpg';
          }
        });

        // Triez les utilisateurs en fonction de leur note (average_received_roses) et ensuite par profil_verify_id
        this.members.sort((a, b) => {
          // Triez d'abord par average_received_roses en ordre décroissant
          if (b.average_received_roses !== a.average_received_roses) {
            return b.average_received_roses - a.average_received_roses;
          }
          // Si les notes sont égales, triez par profil_verify_id en ordre décroissant
          return b.profil_verify_id - a.profil_verify_id;
        });
      },
      (erreur) => {
        console.error(
          "Erreur lors de la récupération des informations de l'utilisateur :",
          erreur
        );
      }
    );
  }
  sortedMembers() {
    this.members.sort((a, b) => {
      // Vérifiez d'abord si les deux utilisateurs sont en ligne
      if (a.Onlinestatus && b.Onlinestatus) {
        // Si les deux sont en ligne, triez d'abord par note (average_received_roses)
        if (b.average_received_roses !== a.average_received_roses) {
          return b.average_received_roses - a.average_received_roses;
        }
        // Si les notes sont égales, triez par profil_verify_id
        return b.Onlinestatus - a.Onlinestatus;
      } else if (a.Onlinestatus && !b.Onlinestatus) {
        // Si seul l'utilisateur 'a' est en ligne, placez-le en premier
        return -1;
      } else if (!a.Onlinestatus && b.Onlinestatus) {
        // Si seul l'utilisateur 'b' est en ligne, placez-le en premier
        return 1;
      } else {
        // Si les deux sont hors ligne, triez par note (average_received_roses)
        if (b.average_received_roses !== a.average_received_roses) {
          return b.average_received_roses - a.average_received_roses;
        }
        // Si les notes sont égales, triez par profil_verify_id
        return b.Onlinestatus - a.Onlinestatus;
      }
    });
  }
  calculateAge(dateOfBirth: string): number {
    const now = moment();
    const birthDate = moment(dateOfBirth, 'YYYY-MM-DD');
    return now.diff(birthDate, 'years');
  }

  searchByUsername() {
    const searchTerm = this.searchForm.get('searchTerm')?.value;
    if (searchTerm) {
      this.members = this.originalMembers.filter((user: any) =>
        user.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchTerm === '') {
      this.members = this.originalMembers;
    }

    setTimeout(() => {
      if (this.members.length === 0) {
        this.noUsersFound = true;
      }
    }, 5000);

    // console.log(this.members);
  }

  getImageProfil(image: string) {
    if (image) {
      const imagePath = image.replace('users_images/', '');
      return `${this.imgPath}${imagePath}`;
    } else {
      return '';
    }
  }

  onTableDataChange(event: any) {
    this.page = event;
    // this.getAllUser();
    this.scrollToTop();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getAllUser();
  }

  applyFilters() {
    let filteredMembers = [...this.originalMembers]; // On part des membres d'origine

    if (this.selectedCorpulence) {
      filteredMembers = filteredMembers.filter(
        (user: any) => user.corpulence === this.selectedCorpulence
      );
    }

    if (this.selectedProfil) {
      filteredMembers = filteredMembers.filter(
        (user: any) => user.account_type === this.selectedProfil
      );
    }

    if (this.selectedTeint) {
      filteredMembers = filteredMembers.filter(
        (user: any) => user.teint === this.selectedTeint
      );
    }

    if (this.minAge && this.maxAge) {
      filteredMembers = filteredMembers.filter((user: any) => {
        const userAge = this.calculateAge(user.date_naissance);
        return userAge >= this.minAge && userAge <= this.maxAge;
      });
    }

    if (this.selectedVille) {
      filteredMembers = filteredMembers.filter(
        (user: any) => user.localisation === this.selectedVille
      );
    }

    if (this.Onlinestatus !== undefined) {
      const Onlinestatus = this.Onlinestatus === 'true';
      filteredMembers = filteredMembers.filter(
        (user: any) => user.Onlinestatus === Onlinestatus
      );
    }

    // Met à jour la liste des membres avec les résultats filtrés
    this.members = filteredMembers;

    // Si aucun utilisateur trouvé après filtrage
    setTimeout(() => {
      this.noUsersFound = this.members.length === 0;
    }, 5000);
  }

  searchByCorpulence() {
    this.applyFilters();
  }

  searchByProfil() {
    this.applyFilters();
  }

  searchByTeint() {
    this.applyFilters();
  }

  searchByAge() {
    this.applyFilters();
  }

  searchByVille() {
    this.applyFilters();
  }

  filterByUserOnline() {
    this.applyFilters();
  }

  reset() {
    this.searchForm.get('searchTerm')?.setValue('');
    this.selectedCorpulence = null;
    this.selectedTeint = null;
    this.selectedAge = [18, 65];
    this.selectedVille = null;
    this.members = this.originalMembers;
  }
  updateStars(note: number): void {
    const totalStars = 5;
    const filledStars = Math.floor(note);
    this.halfStar = note % 1 >= 0.5 ? 1 : 0; // Stockage de la valeur de halfStar
    const emptyStars = totalStars - filledStars - this.halfStar;

    this.filledStarsArray = new Array(filledStars);
    this.emptyStarsArray = new Array(emptyStars);
  }
  getFilledStarArray(rating: number): any[] {
    return new Array(Math.floor(rating));
  }

  getEmptyStarArray(rating: number): any[] {
    const emptyStars = 5 - Math.ceil(rating);
    return new Array(emptyStars);
  }
  getAllUserConnected() {
    this.homeService.getAllUsers()?.subscribe(
      (res: any) => {
        this.members = res?.users;
        this.recent_users = res?.recent_users.data;
        this.noRecentFound = this.recent_users.length !== 0;

        if (this.members.length == 0) this.noUsersFound = true;
        this.members.forEach((user: any) => {
          // const photoProfil = user.images.find(
          //   (image: any) => image.type === 'photoProfil'
          // );
          // if (photoProfil) {
          user.profileImage = this.getImageProfil(user.photo_profil.path);
          // }
          //else {
          //   // user.profileImage =
          //   //   '../../../assets/images/profile/pic-female.jpeg';
          // }
          this.members.forEach((members) => {
            members.Onlinestatus = this.isCurrentUserOnline.includes(
              members.id
            );
          });
          this.originalMembers = this.members;
        });
        // Triez les utilisateurs en fonction de leur note (average_received_roses) et ensuite par profil_verify_id
        this.members.sort((a, b) => {
          // Vérifiez d'abord si les deux utilisateurs sont en ligne
          if (a.Onlinestatus && b.Onlinestatus) {
            // Si les deux sont en ligne, triez d'abord par note (average_received_roses)
            if (b.average_received_roses !== a.average_received_roses) {
              return b.average_received_roses - a.average_received_roses;
            }
            // Si les notes sont égales, triez par profil_verify_id
            return b.Onlinestatus - a.Onlinestatus;
          } else if (a.Onlinestatus && !b.Onlinestatus) {
            // Si seul l'utilisateur 'a' est en ligne, placez-le en premier
            return -1;
          } else if (!a.Onlinestatus && b.Onlinestatus) {
            // Si seul l'utilisateur 'b' est en ligne, placez-le en premier
            return 1;
          } else {
            // Si les deux sont hors ligne, triez par note (average_received_roses)
            if (b.average_received_roses !== a.average_received_roses) {
              return b.average_received_roses - a.average_received_roses;
            }
            // Si les notes sont égales, triez par profil_verify_id
            return b.Onlinestatus - a.Onlinestatus;
          }
        });
      },
      (erreur) => {
        console.error(
          "Erreur lors de la récupération des informations de l'utilisateur :",
          erreur
        );
      }
    );
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  welcomeModal(content: any) {
    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-title',
      windowClass: 'my-class',
      centered: true,
      backdrop: 'static',
    });
    // localStorage.removeItem('newU');
  }

  closePopup() {
    this.modalService.dismissAll();
    const notifKey = 'newU' + this.user_id;
    const newU = localStorage.getItem(notifKey) || 'false';
    if (newU === '1') {
      localStorage.removeItem(notifKey);
    }
  }
  greetUser(pseudo: any) {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    // Déterminer le message de salutation en fonction de l'heure
    if (currentHour < 12) {
      this.greetingMessage = 'Bonjour ';
    } else if (currentHour < 18) {
      this.greetingMessage = 'Bon après-midi ';
    } else {
      this.greetingMessage = 'Bonsoir ';
    }

    // Ajout du message personnalisé pour l'utilisateur
    this.greetingMessage +=
      '❤️ ' + pseudo + ' ❤️ ! Quel bonheur de te retrouver sur SHOKII.';
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
}
