import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/_services/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-recover',
  templateUrl: './password-recover.component.html',
  styleUrls: [
    '../../../assets/css/globale.css',
    './password-recover.component.scss',
  ],
})
export class PasswordRecoverComponent implements OnInit {
  mail!: string;
  modalRef: BsModalRef | undefined;
  code: string[] = ['', '', '', '', '', '', '', ''];
  @ViewChild('verificationModal') verificationModal!: TemplateRef<any>; // Add this line
  verificationCode: any;
  token!: number;
  isVerify: boolean = false;
  passwordForm!: FormGroup;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.passwordForm = this.formBuilder.group({
      // newPassword: ['', [Validators.required, Validators.minLength(8)]],
      // confirmPassword: ['', Validators.required, Validators.minLength(8)],
      newPassword: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
      confirmPassword: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
    });
  }
  ngOnInit(): void {
    // this.isVerify = false;
    // this.openVerificationModal();
  }
  loginForm = new FormGroup({
    mail: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S+@\S+\.\S+$/),
    ]),
  });

  openVerificationModal() {
    this.modalRef = this.modalService.show(this.verificationModal, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-dialog-lg-centered',
    });
  }

  /*   onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
  } */

  onSubmit() {
    if (this.loginForm.valid) {
      this.mail = this.loginForm.value.mail || '';
      this.authService.forgotPassword(this.mail).subscribe(
        (response) => {
          console.log(response);
          Swal.fire({
            icon: 'success',
            html: 'Un code à 6 chiffres a été envoyé à cet mail(<b>Vérifiez vos spams si nécessaire</b>) .',
            showConfirmButton: true,
            timer: 3000,
          });
          this.openVerificationModal();

          // Naviguer vers la route /verify

          //   this.router.navigate(['/accueil']);
          /*     this.router.navigate(['/verify'], {
            queryParams: { phoneNumber: phoneNumber },
          }); */
        },
        (error) => {
          if (error.status == 500) {
            Swal.fire({
              icon: 'error',
              title: 'Veuillez entrer un email valide ...',
              showConfirmButton: true,
              timer: 1500,
            });
          } else if (error.status == 400) {
            Swal.fire({
              icon: 'error',
              title: 'E-mail introuvable ...',
              showConfirmButton: true,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Connexion impossible . Veuillez réesayer pus tard ...',
              showConfirmButton: true,
            });
          }
          // Gestion des erreurs de l'appel API
          console.error('Erreur lors du login :', error);
          console.error("Status de l'Erreur lors du login :", error.status);
        }
      );
    }
  }

  verifyCode() {
    this.token = parseInt(this.code.join(''));
    const email = this.loginForm.value.mail;
    console.log(this.token);
    this.authService.verifyPin(this.token, email).subscribe(
      (response) => {
        console.log('reuissi');
        console.log(response);
        if (response.success) {
          console.log('Code de vérification valide');
          this.isVerify = true;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Verification Reuissie ...',
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          console.log('Code de vérification invalide');
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Code de vérification invalide ou expiré ...',
            showConfirmButton: false,
            timer: 2000,
          });
        }
      },
      (error) => {
        // Gestion des erreurs de l'appel API
        console.error('Erreur lors de la vérification du code OTP :', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Code de vérification invalide ou expiré ...',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    );
  }
  digitValidate(event: any, index: number) {
    const value = event.target.value.replace(/[^0-9]/g, '');
    event.target.value = value;
    this.code[index - 1] = value;

    if (value) {
      this.tabChange(index);
    }
  }

  tabChange(index: number) {
    const nextElement = document.querySelector(
      `#otp${index + 1}`
    ) as HTMLInputElement;
    if (nextElement) {
      nextElement.focus();
    }
  }

  pasteCode(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text/plain') || '';

    // Filtre les chiffres et ne prend que les 6 premiers
    const digits = pastedText.replace(/[^0-9]/g, '').slice(0, 6);

    // Remplit les champs d'entrée avec les chiffres collés
    digits.split('').forEach((digit, index) => {
      this.code[index] = digit;
      const inputElement = document.querySelector(
        `#otp${index + 1}`
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = digit;
      }
    });

    // Déplace le focus vers le champ suivant disponible après la dernière valeur collée
    const nextElement = document.querySelector(
      `#otp${digits.length + 1}`
    ) as HTMLInputElement;
    if (nextElement) {
      nextElement.focus();
    }
  }
  handleBackspace(event: KeyboardEvent, index: number) {
    const currentElement = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && currentElement.value === '') {
      const previousElement = document.querySelector(
        `#otp${index - 1}`
      ) as HTMLInputElement;
      if (previousElement) {
        previousElement.focus();
      }
    } else if (event.key === 'ArrowLeft') {
      const previousElement = document.querySelector(
        `#otp${index - 1}`
      ) as HTMLInputElement;
      if (previousElement) {
        previousElement.focus();
      }
    } else if (event.key === 'ArrowRight') {
      const nextElement = document.querySelector(
        `#otp${index + 1}`
      ) as HTMLInputElement;
      if (nextElement) {
        nextElement.focus();
      }
    }
  }
  resendMail() {
    this.onSubmit();
    this.code = ['', '', '', '', '', '', '', ''];
  }

  checkpin() {}
  // changePass() {
  //   if (this.passwordForm.valid) {
  //     const password = this.passwordForm.value.newPassword;
  //     const password_confirmation = this.passwordForm.value.newPassword;
  //     const email = this.loginForm.value.mail;

  //     if (
  //       !password ||
  //       !password_confirmation ||
  //       password.value !== password_confirmation.value
  //     ) {
  //       Swal.fire({
  //         icon: 'warning',
  //         title: 'Attention',
  //         text: 'Les deux nouveaux mots de passe ne correspondent pas.',
  //       });
  //       return;
  //     } else {
  //       this.authService
  //         .changePassword(password, password_confirmation, email)
  //         ?.subscribe(
  //           (response: any) => {
  //             console.log('Mot de passe modifié avec succès', response);
  //             Swal.fire({
  //               icon: 'success',
  //               title: 'Succès',
  //               text: 'Votre mot de passe a été modifié avec succès.',
  //             }).then(() => {
  //               this.closeVerificationModal();
  //               this.router.navigate(['/login']);
  //             });
  //             this.passwordForm.reset();
  //           },
  //           (error) => {
  //             // Gérer les erreurs de l'API
  //             console.error(
  //               'Erreur lors de la modification du mot de passe',
  //               error
  //             );
  //             if (error.status == 422) {
  //               Swal.fire({
  //                 icon: 'error',
  //                 title: 'Echec !',
  //                 text: 'Veuillez saisir un mot de passe à huit caractères minimum !',
  //               });
  //             } else {
  //               Swal.fire({
  //                 icon: 'error',
  //                 title: 'Echec !',
  //                 text: 'Erreur lors de la modification du mot de passe ! Veuillez réessayer .',
  //               });
  //             }
  //           }
  //         );
  //     }
  //   } else {
  //     // Gérer les erreurs de validation
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Erreur',
  //       text: 'Le mot de passe doit être de huit caractères minimum . ',
  //     });
  //   }
  // }
  changePass() {
    const password = this.passwordForm.value.newPassword;
    const password_confirmation = this.passwordForm.value.confirmPassword; // Utilisez confirmPassword au lieu de newPassword
    const email = this.loginForm.value.mail;

    if (
      !password ||
      !password_confirmation ||
      password !== password_confirmation
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Les deux nouveaux mots de passe ne correspondent pas.',
      });
      return;
    } else if (!this.passwordForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'erreur',
        text: 'Le mot de passe doit être un minimum de 8 caracters !',
      });
    } else {
      this.authService
        .changePassword(password, password_confirmation, email)
        ?.subscribe(
          (response: any) => {
            console.log('Mot de passe modifié avec succès', response);
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Votre mot de passe a été modifié avec succès.',
            }).then(() => {
              this.closeVerificationModal();
              this.router.navigate(['/login']);
            });
            this.passwordForm.reset();
          },
          (error) => {
            // Gérer les erreurs de l'API
            console.error(
              'Erreur lors de la modification du mot de passe',
              error
            );
            Swal.fire({
              icon: 'error',
              title: 'Echec de modification !',
              text: error,
            });
          }
        );
    }
  }

  closeVerificationModal(): void {
    this.modalRef?.hide();
  }
  goback() {
    history.back();
  }
}
