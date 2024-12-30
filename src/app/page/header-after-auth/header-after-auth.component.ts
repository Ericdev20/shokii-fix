import { Component, ElementRef, Renderer2, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/core/_services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/_services/shared/user.service';
import { KissService } from 'src/app/core/_services/kiss.service';
import { io } from 'socket.io-client';
import * as $ from 'jquery';
// import  from '../../../assets/js/main.ts';

@Component({
  selector: 'app-header-after-auth',
  templateUrl: './header-after-auth.component.html',
  styleUrls: ['../../../assets/css/globale.css'],
})
export class HeaderAfterAuthComponent {
  usersOnline: any;
  private socket: any;
  pseudo: any;
  profileImage!: any;
  sexe: any;
  imgPath: string = environment.imgPath;
  wallet: any = 0;
  newMessageCount: number = 0;
  id: any;
  menuItems: any[];
  subMenuItems!: any[];
  default = environment.defaultImage; // default = environment.defaultImage;

  newMsg: any = '';

  constructor(
    private authService: AuthService,
    private kissService: KissService,
    private el: ElementRef,
    private renderer: Renderer2,
    // private socket: Socket,
    private router: Router
  ) {
    this.id = localStorage.getItem('id');
    this.menuItems = [
      { label: 'Accueil', link: '/accueil' },
      { label: 'Messagerie', link: '/chat' },
      { label: 'Abonnement', link: '/abonnement' },
      { label: "Historique d'achat", link: '/purchase' },
      // { label: 'Mes profils débloqués', link: '/purchase' },
      { label: 'FAQ', link: '/faq' },
      { label: 'Contact', link: '/contact' },
    ];

    this.subMenuItems = [
      /* {
      label: 'Wallet : ' + this.wallet + 'KISS',

      color: 'fuchsia',
      icon: 'fas fa-donate',
    }, */
      { label: 'Achat KISS', link: '/checkout', color: '', icon: '' },
    ];
    this.socket = io(environment.nodeUrl);
    this.socket.on('onlineUsers', (onlineUsers: any) => {});
    this.socket.on('chat message', (message: any) => {
      if (message.to_id == this.id) {
        console.log('un message reçu', message);
        localStorage.setItem('msg', '1');
        this.newMsg = '1';
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: 'info',
          title: 'Vous avez un nouveau message 📩 ',
        });
      }
    });

    // this.socket = io(environment.nodeUrl);
    this.socket.on('disconnected', (userId: any) => {
      // console.log('Utilisateurs deconnecté : ', userId);
      this.usersOnline = userId;
      // Mettez à jour votre interface utilisateur en fonction des utilisateurs en ligne
    });

    // scriptjs.default({})
  }

  ngOnInit(): void {
    this.newMsg = localStorage.getItem('msg');
    this.getWallet();
    /* this.userService.getUser()?.subscribe(
      (res: any) => {
        const user = res.user;
        // const wallet = res.wallet;
        console.log('res header', res);
        this.pseudo = user.pseudo;
        this.sexe = user.role_id;
        this.wallet =
          user.wallet?.nombreKiss +
          (user.paiements?.reduce(
            (total: any, paiement: { nombreKiss: any }) =>
              total + paiement.nombreKiss,
            0
          ) || 0);

        // console.log('Aucune photo de profil trouvée.', this.sexe);
        this.socket.emit('userConnected', this.id);
        const menuFemme = [
          { label: 'Accueil', link: '/accueil' },
          { label: 'Messagerie', link: '/chat' },
          // { label: 'Abonnement', link: '/abonnement' },
          { label: "Historique d'achat", link: '/purchase' },
          { label: 'FAQ', link: '/faq' },
          { label: 'Contact', link: '/contact' },
        ];

        if (this.sexe === 3) this.menuItems = menuFemme;
        const photoProfil = user.images.find(
          (image: any) => image.type === 'photoProfil'
        );

        if (photoProfil) {
          const imagePath = photoProfil.path.replace('users_images/', '');
          this.profileImage = `${this.imgPath}${imagePath}`;
        } else {
          // console.log('Aucune photo de profil trouvée.');
        }
      },
      (erreur) => {
        console.error(
          "Erreur lors de la récupération des informations de l'utilisateur :",
          erreur
        );
      }
    );*/
    const userJSON: string | null = localStorage.getItem('user');
    if (userJSON !== null) {
      const user: {
        id: string;
        pseudo: string;
        role_id: string;
        profil_verify_id: string;
      } = JSON.parse(userJSON);
      this.id = user.id;
      this.pseudo = user.pseudo;
      this.sexe = user.role_id;
    }
    const profil_picc = localStorage.getItem('pImage');
    if (profil_picc !== null) {
      this.profileImage = this.getImageProfil(profil_picc);
    }

    this.socket.emit('userConnected', this.id);
    const menuFemme = [
      { label: 'Accueil', link: '/accueil' },
      { label: 'Messagerie', link: '/chat' },
      // { label: 'Abonnement', link: '/abonnement' },
      // { label: "Historique d'achat", link: '/purchase' },
      { label: 'Mes Avis', link: '/reviews' },
      { label: 'FAQ', link: '/faq' },
      { label: 'Contact', link: '/contact' },
    ];
    if (this.sexe === 3) this.menuItems = menuFemme;
  }
  getImageProfil(image: string) {
    if (image) {
      const imagePath = image.replace('users_images/', '');
      return `${this.imgPath}${imagePath}`;
    } else {
      return '';
    }
  }
  ngAfterViewInit() {
    $(document).ready(() => {
      //menu header
      function showWidth(ele: any, w: any) {
        return w;
      }
      $('.header-bar').on('click', () => {
        $('.menu').toggleClass('active');
        $('.header-bar').toggleClass('active');
        $('.overlay').toggleClass('active');
      });

      $('.overlay').on('click', () => {
        $('.menu').removeClass('active');
        $('.header-bar').removeClass('active');
        $('.overlay').removeClass('active');
      });

      $('ul>li>.submenu').parent('li').addClass('menu-item-has-children');

      $('ul')
        .parent('li')
        .hover(function () {
          var menu = $(this).find('ul');
          var menupos = menu.offset();
          if (menupos && menu.length > 0) {
            // Vérifier si menu est défini
            if (
              menupos.left + showWidth('menu', $(menu).width()) >
              showWidth('window', $(menu).width())
            ) {
              var newpos = -showWidth('menu', $(menu).width());
              menu.css({
                left: newpos,
              });
            }
          }
        });

      $('.menu li a').on('click', (e) => {
        var element = $(e.target).parent('li');
        if (element.hasClass('open')) {
          element.removeClass('open');
          element.find('li').removeClass('open');
          element.find('ul').slideUp(300, 'swing');
        } else {
          element.addClass('open');
          element.children('ul').slideDown(300, 'swing');
          element.siblings('li').children('ul').slideUp(300, 'swing');
          element.siblings('li').removeClass('open');
          element.siblings('li').find('li').removeClass('open');
          element.siblings('li').find('ul').slideUp(300, 'swing');
        }
      });

      //faq
    });
  }

  removeClass(label: any) {
    if (label === 'Messagerie') {
      this.readMsg();
    }
    const divElement1 = this.el.nativeElement.querySelector('#monDiv1');
    const divElement2 = this.el.nativeElement.querySelector('#monDiv2');
    if (divElement1 && divElement2) {
      this.renderer.removeClass(divElement1, 'active');
      this.renderer.removeClass(divElement2, 'active');
    }
  }

  public logout(): void {
    const pseudo = this.pseudo ? this.pseudo : ' ami(e)';
    this.socket.emit('disconnected', this.id);
    this.authService.logout();
    // this.ngOnDestroy() ;
    this.router.navigate(['/']);
    // window.location.reload();

    // window.location.href = '/';

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: 'A très vite ' + pseudo + '😎😎..',
    });
  }
  goSuscrib() {
    this.router.navigate(['/abonnement']);
  }
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  getWallet() {
    this.kissService.getWallet()?.subscribe(
      (res: any) => {
        // this.wallet = res.wallet.nombreKiss + res.paiements?.nombreKiss;
        this.wallet =
          res.wallet?.nombreKiss +
          (res.paiements?.reduce(
            (total: any, paiement: { nombreKiss: any }) =>
              total + paiement.nombreKiss,
            0
          ) || 0);
      },
      (erreur) => {
        console.error(
          'Erreur lors de la récupération des informations de wallet :',
          erreur
        );
      }
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    this.socket.emit('disconnected', this.id);
  }
  readMsg() {
    localStorage.removeItem('msg');
    this.newMsg = '';
  }
  ngOnDestroy(): void {
    // Émettre l'événement lorsque l'utilisateur se déconnecte de votre application Angular
    this.socket.emit('disconnected', this.id);
    this.socket.on('disconnected', () => {
      console.log('Déconnecté du serveur');
      // Mettez en œuvre les actions nécessaires en cas de déconnexion
    });
  }
}
