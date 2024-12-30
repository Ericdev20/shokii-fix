import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KissService } from 'src/app/core/_services/kiss.service';
import { UserService } from 'src/app/core/_services/shared/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subcrip-checkout',
  templateUrl: './subcrip-checkout.component.html',
  styleUrls: [
    './subcrip-checkout.component.scss',
    '../../../assets/css/globale.css',
  ],
})
export class SubcripCheckoutComponent {
  wallet: any = 0;
  formGroup!: FormGroup;
  phoneNumber: any;
  email: any;
  id: number;
  abonnement: any;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private kissService: KissService,
    private router: Router,
    private route: ActivatedRoute,

    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      kiss: [1, [Validators.required, Validators.min(1)]],
      montantAPayer: ['', Validators.required],
      numeroTelephone: ['+22901', Validators.required],
      network: ['mtn_open', Validators.required],
    });
    this.id = +this.route.snapshot.params['id'];
  }
  ngOnInit(): void {
    this.userService.getUser()?.subscribe(
      (res: any) => {
        this.phoneNumber = res.user.phone_number;
        this.email = res.user.email;
      },
      (erreur) => {
        console.error(
          "Erreur lors de la récupération des informations de l'abonnement :",
          erreur
        );
      }
    );
    this.kissService.getAbonnement(this.id)?.subscribe(
      (res: any) => {
        this.abonnement = res;
        this.fillForm();
      },
      (erreur) => {
        console.error(
          "Erreur lors de la récupération des informations de l'abonnement :",
          erreur
        );
      }
    );
  }

  calculateAmount() {
    const kissCount = this.formGroup.get('kiss')?.value;
    const montantParKiss = 25;
    const montantTotal = kissCount * montantParKiss;

    this.formGroup.get('montantAPayer')?.setValue(`${montantTotal} Fcfa`);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const formData = this.formGroup.value;
      const montantAPayerValue = formData.montantAPayer;
      const amount =
        montantAPayerValue && typeof montantAPayerValue === 'string'
          ? +montantAPayerValue.replace(' Fcfa', '')
          : 0;
      const data = {
        phone_number: formData.numeroTelephone,
        network: formData.network,
        amount: amount,
        abonnement_id: this.id,
      };

      this.kissService.abonnement(data).subscribe(
        (response) => {
          Swal.fire({
            icon: 'info',
            title: 'Transaction en cours',
            text: "Votre transaction est en cours de traitement. Ceci peut prendre jusqu'à plusieurs minutes . Merci de bien vouloir patienter ...",
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
          const errorMessage =
            error.error?.message ||
            'Nous avons rencontré une erreur lors de la transaction. Veuillez vous assurer que vous disposez des fonds nécessaires sur le numéro, puis réessayez.';

          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            html: errorMessage,
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

  fillForm() {
    const kiss = this.abonnement?.nombreKiss;
    const prix = this.abonnement?.prix;

    this.formGroup.get('kiss')?.setValue(kiss);
    this.formGroup.get('kiss')?.disable();

    this.formGroup.get('montantAPayer')?.setValue(`${prix} Fcfa`);
    this.formGroup.get('montantAPayer')?.disable();
  }
}
