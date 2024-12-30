import { Component } from '@angular/core';
import { KissService } from 'src/app/core/_services/kiss.service';
import * as moment from 'moment';
import 'moment/locale/fr';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: [
    '../../../assets/css/globale.css',
    './transaction-history.component.scss',
  ],
})
export class TransactionHistoryComponent {
  transactions: any[] = [];
  usersOnline: any[] = [];
  isCurrentUserOnline: boolean = false;
  private intervalId: any;

  constructor(private kissService: KissService) {}
  ngOnInit(): void {
    this.fetchTransactions();
    this.intervalId = setInterval(() => {
      this.fetchTransactions(false);
    }, 10000); // 10 seconds
  }

  fetchTransactions(load: boolean = true): void {
    this.kissService.getUserTransactions(load)?.subscribe(
      (res: any) => {
        this.transactions = res.transactions;
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des informations des transactions :',
          error
        );
      }
    );
  }
  getStatusClass(statut: string): string {
    const statusClasses: any = {
      canceled: 'text-danger',
      FAILED: 'text-danger',
      declined: 'text-danger',
      SUCCESSFUL: 'green',
      approved: 'green',
      transferred: 'green',
      PENDING: 'text-info',
    };
    return statusClasses[statut] || ''; // Retourne une chaîne vide si le statut n'est pas dans l'objet.
  }
  getTransactionTypeClass(type: string): string {
    const typeClasses: any = {
      'Achat KISS': 'text-primary text-center',
      'Abonnement': 'green text-center',
    };
    return typeClasses[type] || ''; // Retourne une chaîne vide si le type n'est pas dans l'objet.
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  public formatDateTime(dateTimeStr: string): string {
    const dateMoment = moment(dateTimeStr);
    const formattedDateTime = dateMoment.format('D MMM YYYY HH:mm:ss');
    return formattedDateTime;
  }
}
