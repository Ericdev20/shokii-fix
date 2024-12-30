import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from 'src/app/core/_services/register.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OTPComponent {
  code: string[] = ['', '', '', '', '', ''];
  phone_number!: string;
  verification_code!: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,

    private RegisterService: RegisterService
  ) {}

  // verifyOtp(otpCode: string): void {
  //   this.RegisterService.verifyOtp(otpCode , phoneNumber).subscribe(
  //     (response) => {
  //       // Traitement de la réponse de l'API (si nécessaire)
  //       console.log('Code OTP vérifié avec succès');
  //     },
  //     (error) => {
  //       // Gestion des erreurs de l'appel API
  //       console.error('Erreur lors de la vérification du code OTP :', error);
  //     }
  //   );
  // }
  //
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.phone_number = params['phoneNumber'];

      // Utilisez la valeur phoneNumber comme vous le souhaitez dans votre composant
    });
  }

  digitValidate(event: any) {
    console.log(event.target.value);
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  tabChange(val: number) {
    const ele = document.querySelectorAll('input');

    if (ele[val - 1]?.value !== '') {
      ele[val]?.focus();
    } else if (ele[val - 1]?.value === '') {
      ele[val - 2]?.focus();
    }
  }

  onSubmit() {
    this.verification_code = parseInt(this.code.join(''));
    console.log(this.verification_code);
    this.RegisterService.verifyOtp(
      this.verification_code,
      this.phone_number
    ).subscribe(
      (response) => {
        console.log('reuissi');
        console.log(response);
        if (response.success) {
          console.log('Code de vérification valide');
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Verification Reuissie ...',
            showConfirmButton: false,
            timer: 2000,
          });
          this.router.navigate(['/register'], {
            queryParams: { phoneNumber: this.phone_number },
          });
          console.log('redirection ');
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
  resendOTP() {
    this.RegisterService.sendOtp(this.phone_number).subscribe(
      (response) => {
        console.log(response);
        // Afficher la swal de succès
        Swal.fire({
          icon: 'info',
          title:
            'Code de verification Renvoyé . Consulter votre boîte de messagerie',
          showConfirmButton: false,
          timer: 2500,
        });
      },
      (error) => {
        // Gestion des erreurs de l'appel API
        console.error("Erreur lors de l'envoi du code OTP :", error);
      }
    );
  }

  getCurrentCity() {
    this.http.get('http://ip-api.com/json/').subscribe(
      (response: any) => {
        const city = response.city;
        console.log('Ville de résidence actuelle est :', city);
        // Faites quelque chose avec la ville de résidence
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération de la ville de résidence :',
          error
        );
      }
    );
  }
}
