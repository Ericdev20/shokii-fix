import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UtilitiesService } from 'src/app/core/_services/utilities.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss', '../../../assets/css/globale.css'],
})
export class FaqComponent implements OnInit {
  faqs: any;
  searchForm!: FormGroup;
  originalfaqs: any;
  constructor(private utilitiesService: UtilitiesService) {}

  ngOnInit(): void {
    this.utilitiesService.getAllFaq()?.subscribe(
      (res: any) => {
        this.originalfaqs = this.faqs = res.map((faq: any) => ({
          ...faq,
          isOpen: false,
        }));
      },
      (erreur) => {
        console.error('Erreur lors de la récupération des faq:', erreur);
      }
    );

    this.searchForm = new FormGroup({
      searchTerm: new FormControl(''),
    });
  }
  /*
  faqs = [
    {
      title: "Qu'est-ce que c'est SHOKII ?",
      content:
        "Being that Tickto does not own any of the tickets sold on our site, we do not have the ability to exchange or replace tickets with other inventory. If you would like to 'upgrade' or change the location of your seats, you can relist your current tickets for sale here and purchase other tickets of your choice.",
      isOpen: false,
    },
    {
      title: 'Quel type de photo puis-je utiliser ?',
      content:
        "Being that Tickto does not own any of the tickets sold on our site, we do not have the ability to exchange or replace tickets with other inventory. If you would like to 'upgrade' or change the location of your seats, you can relist your current tickets for sale here and purchase other tickets of your choice.",
      isOpen: false,
    },
    {
      title: 'Quels sont les moyens de paiement ?',
      content:
        "Being that Tickto does not own any of the tickets sold on our site, we do not have the ability to exchange or replace tickets with other inventory. If you would like to 'upgrade' or change the location of your seats, you can relist your current tickets for sale here and purchase other tickets of your choice.",
      isOpen: false,
    },
    {
      title: 'Comment lever mes restrictions sur le site ?',
      content:
        "Being that Tickto does not own any of the tickets sold on our site, we do not have the ability to exchange or replace tickets with other inventory. If you would like to 'upgrade' or change the location of your seats, you can relist your current tickets for sale here and purchase other tickets of your choice.",
      isOpen: false,
    },
    {
      title: 'Comment avoir le badge vérifié ?',
      content:
        "Being that Tickto does not own any of the tickets sold on our site, we do not have the ability to exchange or replace tickets with other inventory. If you would like to 'upgrade' or change the location of your seats, you can relist your current tickets for sale here and purchase other tickets of your choice.",
      isOpen: false,
    },
    {
      title: 'Puis-je supprimer mon profil ?',
      content:
        "Being that Tickto does not own any of the tickets sold on our site, we do not have the ability to exchange or replace tickets with other inventory. If you would like to 'upgrade' or change the location of your seats, you can relist your current tickets for sale here and purchase other tickets of your choice.",
      isOpen: false,
    },
  ]; */

  toggleFaq(faq: any) {
    faq.isOpen = !faq.isOpen;
  }

  search() {
    const searchTerm = this.searchForm.get('searchTerm')?.value;
    if (searchTerm !== '' && searchTerm !== undefined) {
      this.faqs = this.faqs.filter(
        (faq: any) =>
          (faq?.questions &&
            faq?.questions.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (faq?.reponses &&
            faq?.reponses.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } else {
      // Si le terme de recherche est vide, rétablir la liste originale des FAQs
      this.faqs = this.originalfaqs;
      // this.ngOnInit() ;
    }

    // Afficher les résultats dans la console
    console.log(this.faqs);
  }
}
