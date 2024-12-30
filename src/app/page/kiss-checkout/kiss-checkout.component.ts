import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KissService } from 'src/app/core/_services/kiss.service';
import { UserService } from 'src/app/core/_services/shared/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kiss-checkout',
  templateUrl: './kiss-checkout.component.html',
  styleUrls: [
    './kiss-checkout.component.scss',
    '../../../assets/css/globale.css',
  ],
})
export class KissCheckoutComponent implements OnInit {
  wallet: any = 0;
  formGroup!: FormGroup;
  phoneNumber: any;
  email: any;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private kissService: KissService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      kiss: [1, [Validators.required, Validators.min(1)]],
      montantAPayer: ['200 Fcfa', Validators.required],
      numeroTelephone: ['+22901', Validators.required],
      network: ['mtn_open', Validators.required],
    });
  }
  ngOnInit(): void {
    this.userService.getUser()?.subscribe(
      (res: any) => {
        this.phoneNumber = res.user.phone_number;
        this.email = res.user.email;
      },
      (erreur) => {
        console.error(
          "Erreur lors de la récupération des informations de l'utilisateur :",
          erreur
        );
      }
    );
  }

  calculateAmount() {
    const kissCount = this.formGroup.get('kiss')?.value;
    const montantParKiss = 200;
    const montantTotal = kissCount * montantParKiss;

    this.formGroup.get('montantAPayer')?.setValue(`${montantTotal} Fcfa`);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const formData = this.formGroup.value;
      const data = {
        phone_number: formData.numeroTelephone,
        amount: +formData.montantAPayer.replace('Fcfa', ''),
        kiss: +formData.kiss,
        network: formData.network,
      };
      console.log('data', data);

      this.kissService.buyKiss(data).subscribe(
        (response) => {
          Swal.fire({
            icon: 'info',
            title: 'Transaction en cours',
            html:
              "Votre transaction est en cours de traitement. </br> Ceci peut prendre jusqu'à quelques minutes ." +
              '</br></br>Merci de bien vouloir patienter ...',
            showConfirmButton: true,
            allowOutsideClick: false,
            confirmButtonColor: '#d63384',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['purchase']);
            }
          });
        },
        (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Nous avons rencontré une erreur lors de la transaction.\nVeuillez vous assurer que vous disposez des fonds nécessaires sur le numéro, puis réessayez.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez entrer un numéro de paiement valide.',
      });
    }
  }
}
