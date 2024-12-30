import { Component, ViewEncapsulation } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { KissService } from 'src/app/core/_services/kiss.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: [
    './subscription.component.scss',
    '../../../assets/css/globale.css',
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOut', [
      state('open', style({ opacity: 1 })),
      state('closed', style({ opacity: 0 })),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ]),
  ],
})
export class SubscriptionComponent {
  Subscrips: any;
  constructor(private kissService: KissService, private router: Router) {}

  ngOnInit() {
    this.getPackAbonnement();
  }

  /*   Subscrips = [
    { id: 1, time: '1semaine', kiss: '10', prix: '500' },
    { id: 2, time: '1 Mois ', kiss: '30', prix: '1500' },

    { id: 3, time: '1 an ', kiss: '1000', prix: '10000' },

    { id: 4, time: 'A vie', kiss: 'Illimité', prix: '50000' },
  ]; */

  getPackAbonnement() {
    this.kissService.getPackAbonnement()?.subscribe(
      (res: any) => {
        this.Subscrips = res;
      },
      (erreur: any) => {
        console.error(
          'Erreur lors de la récupération des informations de wallet :',
          erreur
        );
      }
    );
  }
  ackiss() {
    this.router.navigate(['/checkout']);
  }
}
