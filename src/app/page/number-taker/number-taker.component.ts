import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RegisterService } from 'src/app/core/_services/register.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/_services/auth.service';
@Component({
  selector: 'app-number-taker',
  templateUrl: './number-taker.component.html',
  styleUrls: ['../../../assets/css/globale.css'],
})
export class NumberTakerComponent {
  formBuilder: any;
  formGroup: any;
  constructor(
    private registerService: RegisterService,
    private authService: AuthService,
    private router: Router
  ) {
    this.formGroup = new FormGroup({
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^01[0-9]{8}$/),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
    });
  }

  ngOnInit() {
    localStorage.clear();
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/accueil']);
    }
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const phoneNumber = '+229' + this.formGroup.value.phoneNumber;

      this.authService.checkPhone(phoneNumber).subscribe(
        (response) => {
          if (response.success) {
            this.router.navigate(['/register'], {
              queryParams: { phoneNumber: phoneNumber },
            });
          } else {
            // console.log('Email already exists:', response.email);
            Swal.fire({
              icon: 'error',
              title: 'Utilisateur existant.',
              text: 'Un compte existe déjà avec ce numéro.',
            });
          }
        },
        (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur lors de la vérification du numéro.',
            text: "Une erreur s'est produite lors de la vérification du numéro. Veuillez réessayer plus tard.",
          });
        }
      );

      /*  this.registerService.sendOtp(phoneNumber).subscribe(
        (response) => {
          console.log(response);
          // Afficher la swal de succès
      Swal.fire({
            icon: 'info',
            title:
              'Code de verification envoyé . Consulter votre boîte de messagerie',
            showConfirmButton: false,
            timer: 1500,
          });

          // Naviguer vers la route /verify
          this.router.navigate(['/register'], {
            queryParams: { phoneNumber: phoneNumber },
          });
        },
        (error) => {
          // Gestion des erreurs de l'appel API
          console.error("Erreur lors de l'envoi du code OTP :", error);
          Swal.fire({
            icon: 'error',
            title: 'Service indisponible ou Numéro de Telephone incorrecte ! ',
            showConfirmButton: true,
          });
        }
      );*/
    }
  }
}
