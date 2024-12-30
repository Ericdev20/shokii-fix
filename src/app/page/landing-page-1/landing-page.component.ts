import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/core/_services/auth.service';
import { ChatService } from 'src/app/core/_services/chat.service';
import { UtilitiesService } from 'src/app/core/_services/utilities.service';
declare var $: any;
import * as $script from 'scriptjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: [
    './landing-page.component.scss',
    '../../../assets/css/global.css',
  ],
})
export class LandingPageComponent {
  anim: any = ['Les belles rencontres commencent ici !!!'];
  visible = true;
  ngOnInit(): void {
    setTimeout(function () {
      $('.preloader').fadeOut(1000);
    }, 5000);
    this.typeText();
    // this.utilitiesService.welcomeText().subscribe(
    //   (res: any) => {
    //     console.log('text récupére', res);
    //     res.forEach((ani: any) => {
    //       this.anim.push(ani.texte);
    //     });
    //     console.log('text', this.anim);
    //   },
    //   (error) => {
    //     console.error(
    //       'Erreur lors de la récupération des informations  :',
    //       error
    //     );
    //   }
    // );
  }
  senderId = 3;
  isLoggedIn = false;

  constructor(
    //private router: Router,
    private chatService: ChatService,
    private utilitiesService: UtilitiesService,
    private authService: AuthService
  ) {
    this.authService.isAuthenticated.subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated;
    });
    // $script(['../../../assets/js/jquery-3.3.1.min.js'], function () {
    //   // Variable de contrôle pour savoir si le loader a déjà été caché
    //   var loaderCache = false;

    //   // Fonction pour cacher le loader
    //   function cacherLoader() {
    //     $('.preloader').fadeOut(1000);
    //     loaderCache = true;
    //   }

    //   // Fonction pour initialiser le code une fois que la page est prête
    //   function initialiserPage() {
    //     var img = $('.bg_img');
    //     img.css('background-image', function () {
    //       var bg = 'url(' + $(this).data('background') + ')';
    //       return bg;
    //     });
    //   }

    //   // Événement lorsque la page est chargée pour la première fois
    //   $(window).on('load', function () {
    //     initialiserPage();
    //     setTimeout(cacherLoader, 3000); // Cacher le loader après trois secondes même si la page est déjà prête
    //   });

    //   // Événement lorsque la page est affichée (après le chargement initial ou lors du retour en arrière)
    //   $(window).on('pageshow', function (event) {
    //     if (event.originalEvent.persisted && !loaderCache) {
    //       // Si la page est affichée après avoir été mise en cache et que le loader n'a pas déjà été caché
    //       cacherLoader();
    //     }
    //   });

    //   // Événement lorsque l'utilisateur navigue dans l'historique du navigateur (retour en arrière)
    //   $(window).on('popstate', function () {
    //     cacherLoader(); // Cacher le loader lorsque l'utilisateur revient en arrière sur la page
    //   });
    // });
  }

  steps = [
    {
      icon: 'assets/images/h-it-w/icon1.png',
      number: '01',
      title: 'Identifiez-vous!',
      buttonLabel: 'Devenez membre!',
      signupLink: '/signup',
      loginLink: '/login',
    },
    {
      icon: 'assets/images/h-it-w/icon2.png',
      number: '02',
      title: 'Trouver la bonne personne',
      buttonLabel: 'Devenez membre!',
      signupLink: '/signup',
      loginLink: '/login',
    },
    {
      icon: 'assets/images/h-it-w/icon3.png',
      number: '03',
      title: 'Obtenir ses Coordonnées',
      buttonLabel: 'Devenez membre!',
      signupLink: '/signup',
      loginLink: '/login',
    },
    {
      icon: 'assets/images/h-it-w/icon3.png',
      number: '04',
      title: 'Amusez-vous',
      buttonLabel: 'Devenez membre!',
      signupLink: '/signup',
      loginLink: '/login',
    },
  ];

  index = 0;
  charIndex = 0;
  direction: 'forward' | 'backward' = 'forward';
  delay = 100;
  displayText = '';

  /*  typeText() {
    if (this.direction === 'forward') {
      if (this.charIndex < this.anim[this.index].length) {
        this.displayText += this.anim[this.index].charAt(this.charIndex);
        this.charIndex++;
      } else {
        this.direction = 'backward';
        this.delay = 100;
      }
    } else {
      if (this.charIndex > 0) {
        this.displayText = this.anim[this.index].substring(0,this.charIndex - 1);
        this.charIndex--;
      } else {
        this.direction = 'forward';
        this.index = (this.index + 1) % this.anim.length;
        this.delay = 100;
      }
    }

    setTimeout(() => this.typeText(), this.delay);
  }*/
  typeText() {
    if (this.anim[this.index]) {
      if (this.direction === 'forward') {
        if (this.charIndex < this.anim[this.index].length) {
          this.displayText += this.anim[this.index].charAt(this.charIndex);
          this.charIndex++;
        } else {
          this.direction = 'backward';
          this.delay = 100;
        }
      } else {
        if (this.charIndex > 0) {
          this.displayText = this.anim[this.index].substring(
            0,
            this.charIndex - 1
          );
          this.charIndex--;
        } else {
          this.direction = 'forward';
          this.index = (this.index + 1) % this.anim.length;
          this.delay = 100;
        }
      }
    }

    setTimeout(() => this.typeText(), this.delay);
  }
}
