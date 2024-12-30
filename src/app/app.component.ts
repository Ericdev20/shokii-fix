import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/_services/auth.service';
import { UserService } from './core/_services/shared/user.service';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'shokii_fr';
  isLoggedIn = false;
  private tokenKey = 'token';
  valide!: boolean;
  res: any;
  err: any;
  lastInteractionTime!: number;
  socket: any;
  usersOnline: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.socket = io(environment.nodeUrl);
    this.socket.on('disconnected', (userId: any) => {
      // console.log('Utilisateurs deconnecté : ', userId);
      this.usersOnline = userId;
    });

    this.authService.isAuthenticated.subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated;
    });
    this.resetInteractionTimer();
  }

  ngOnInit() {
    this.checkAuthentication();
    this.resetInteractionTimer();

    setInterval(() => {
      this.checkInactivity();
    }, 10000); // Check every 10 second
  }

  isHeaderFooterHidden(): boolean {
    // Récupérer la route actuelle
    const currentRoute = this.router.url.split('?')[0];

    // Vérifier si la route actuelle nécessite le header et le footer
    return (
      currentRoute === '/register' ||
      currentRoute === '/signup' ||
      currentRoute === '/signup' ||
      currentRoute === '/verify' ||
      currentRoute === '/register/auth02' ||
      currentRoute === '/login' ||
      currentRoute === '/password-recover' ||
      currentRoute === '/testApi' ||
      // currentRoute === '/faq' ||
      // currentRoute === '' ||
      // currentRoute === '/' ||
      currentRoute.startsWith('/inbox/')
    );
  }

  isLoaderHidden(): boolean {
    const currentRoute = this.router.url.split('?')[0];
    return currentRoute.startsWith('/inbox/');
  }

  private checkAuthentication() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.authService.verifyToken().subscribe(
        (response: any) => {
          // console.log(response);
        },
        (error: any) => {
          this.authService.logout();
        }
      );
    } else {
      this.authService.logout();
    }
  }
  public cheed() {
    const user = this.userService.getUser()?.subscribe((res: any) => {});
    if (user) {
      // L'utilisateur est authentifié
      return true;
    } else {
      // L'utilisateur n'est pas authentifié
      return false;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keypress', ['$event'])
  resetInteractionTimer() {
    this.lastInteractionTime = Date.now();
  }

  checkInactivity() {
    const currentTime = Date.now();
    if (currentTime - this.lastInteractionTime > INACTIVITY_TIMEOUT) {
      // Déconnectez l'utilisateur ici
      this.ngOnDestroy();
    }
  }

  ngOnDestroy(): void {
    const id = localStorage.getItem('id');
    // Émettre l'événement lorsque l'utilisateur se déconnecte de votre application Angular
    this.socket.emit('disconnected', id);
    this.socket.on('disconnected', () => {
      // Mettez en œuvre les actions nécessaires en cas de déconnexion
    });
  }
}
