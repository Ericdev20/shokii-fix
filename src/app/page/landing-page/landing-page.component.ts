import {
  AfterViewInit,
  Component,
  OnInit,
  Input,
  ViewChild,
} from '@angular/core';
import { AuthService } from 'src/app/core/_services/auth.service';
import { ChatService } from 'src/app/core/_services/chat.service';
import { UtilitiesService } from 'src/app/core/_services/utilities.service';
declare var $: any;
import * as $script from 'scriptjs';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
interface StatItem {
  current: number;
  target: string;
  label: string;
  suffix?: string;
}

interface FloatingElement {
  size: number;
  posX: number;
  posY: number;
  delay: number;
}
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: [
    './landing-page.component.scss',
    '../../../assets/css/global.css',
  ],
})
export class LandingPageComponent implements OnInit {
  @Input() text: string;

  anim: any = ['Les belles rencontres commencent ici !!!'];
  visible = true;
  stats: StatItem[] = [
    { current: 0, target: '10', label: 'Célibataires Actifs', suffix: 'K+' },
    { current: 0, target: '98', label: 'Taux de Satisfaction', suffix: '%' },
    { current: 0, target: '100', label: 'Fiable & Sécurisé', suffix: '%' },
  ];
  floatingElements: FloatingElement[] = [];

  constructor(
    //private router: Router,
    private chatService: ChatService,
    private utilitiesService: UtilitiesService,
    private authService: AuthService
  ) {
    this.authService.isAuthenticated.subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated;
    });
    this.text = 'Votre texte ici';
  }
  ngOnInit(): void {
    setTimeout(function () {
      $('.preloader').fadeOut(1000);
    }, 5000);
    this.typeText();
    this.animateStats();

    this.createFloatingElements();
  }
  private animateStats() {
    this.stats.forEach((stat) => {
      const target = parseInt(stat.target);
      const duration = 5000; // 2 secondes pour l'animation
      const steps = 50; // nombre d'étapes pour l'animation
      const step = target / steps;

      interval(duration / steps)
        .pipe(take(steps))
        .subscribe(() => {
          if (stat.current < target) {
            stat.current = Math.min(stat.current + step, target);
          }
        });
    });
  }
  private createFloatingElements() {
    const elementCount = 25;

    for (let i = 0; i < elementCount; i++) {
      const element: FloatingElement = {
        size: Math.random() * 100 + 50,
        posX: Math.random() * 100,
        posY: Math.random() * 100,
        delay: Math.random() * 5,
      };

      this.floatingElements.push(element);
    }
  }
  senderId = 3;
  isLoggedIn = false;

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
