import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/_services/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core/_services/shared/user.service';
import { delay } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import * as $script from 'scriptjs';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../assets/css/globale.css', './login.component.scss'],
})
export class LoginComponent {
  phone_number!: string;
  private socket: any;
  password!: string;
  returnUrl: any = '';
  imgPath: string = environment.imgPath;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.socket = io(environment.nodeUrl);
    this.socket.on('onlineUsers', (onlineUsers: any) => {
      // console.log('Utilisateurs en ligne : ', onlineUsers);
      // Mettez à jour votre interface utilisateur en fonction des utilisateurs en ligne
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/accueil']);
    }
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'] || '/accueil';
    });
    console.log('lien de retour', this.returnUrl);
    // $script(
    //   [
    //     '../../../assets/js/jquery-3.3.1.min.js',
    //     '../../../assets/js/jquery.ripples.min.js',
    //   ],
    //   function () {
    //     console.log('script chargé avec succès .');
    //     $('.bg-section').ripples({
    //       resolution: 512,
    //       dropRadius: 20,
    //       perturbance: 0.04,
    //     });
    //   }
    // );
  }

  loginForm = new FormGroup({
    // phone: new FormControl('', [Validators.required]) ,
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^01[0-9]{8}$/),
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    password: new FormControl('', [Validators.required]),
  });

  /*   onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
  } */

  onSubmit() {
    if (this.loginForm.valid) {
      const phone_number = '+229' + this.loginForm.value.phone || '';
      const password = this.loginForm.value.password || '';

      this.authService.login(phone_number, password).subscribe(
        (response) => {
          const user = response.user.pseudo;
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('pImage', response.profil_pic);

          const msg = response.unread_messages_count;
          if (msg >= '1') {
            localStorage.setItem('msg', '1');
          }
          localStorage.setItem('pseudo', user);
          localStorage.setItem('id', response.user.id);
          this.socket.emit('userConnected', response.user.id);
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
            title: 'Ravi de vous revoir ' + user + ' 😎😎',
          });
          const newU = localStorage.getItem('newU') ?? 'false';
          if (newU !== '1') {
            // window.location.reload();
            this.router.navigateByUrl(this.returnUrl);
          }
          this.router.navigateByUrl(this.returnUrl);
        },
        (error) => {
          // Swal.fire({
          //   icon: 'error',
          //   text: error.error.message,
          //   title: 'Erreur connexion !',
          //   showConfirmButton: true,
          //   //timer: 1500,
          // });
          // console.error('Erreur lors du login :', error);
          if (error.status === 422) {
            // Erreur d'authentification (identifiant ou mot de passe incorrect)
            Swal.fire({
              icon: 'error',
              text: error.error.message,
              title: 'Erreur de connexion !',
              showConfirmButton: true,
            });
          } else if (error.status === 403) {
            // Erreur d'autorisation (accès refusé)
            Swal.fire({
              icon: 'error',
              text: "Accès refusé. Veuillez contacter le support pour plus d'assistance.",
              title: 'Erreur de connexion !',
              showConfirmButton: true,
            });
          } else if (error.status === 401) {
            // Erreur d'authentification (identifiant ou mot de passe incorrect)
            Swal.fire({
              icon: 'error',
              text: 'Identifiant ou mot de passe incorrect. Veuillez réessayer.',
              title: 'Erreur de connexion !',
              showConfirmButton: true,
            });
          } else if (error.status === 500) {
            // Erreur interne du serveur
            Swal.fire({
              icon: 'error',
              text: "Une erreur interne du serveur s'est produite. Veuillez réessayer plus tard.",
              title: 'Erreur de connexion !',
              showConfirmButton: true,
            });
          } else {
            // Autre erreur non spécifiée
            Swal.fire({
              icon: 'error',
              text: "Une erreur s'est produite lors de la tentative de connexion. Veuillez réessayer.",
              title: 'Erreur de connexion !',
              showConfirmButton: true,
            });
          }
          console.error('Erreur lors du login :', error);
        }
      );
    }
  }
}
