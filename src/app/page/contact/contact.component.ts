import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UtilitiesService } from 'src/app/core/_services/utilities.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss', '../../../assets/css/global.css'],
  providers: [MessageService],
})
export class ContactComponent {
  contactForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private utilitiesService: UtilitiesService,
    private router: Router
  ) {
    this.contactForm = this.formBuilder.group({
      body: ['', Validators.required],
      attachment: [null],
    });
  }

  submitForm() {
    if (this.contactForm.valid) {
      const formData = new FormData();

      // Ajoutez les champs de formulaire à l'objet FormData
      formData.append('body', this.contactForm.get('body')?.value);
      formData.append('attachment', this.contactForm.get('attachment')?.value);

      this.utilitiesService.submitContact(formData).subscribe(
        (response) => {
          console.log('Contact soumis avec succès:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail:
              'Merci pour votre message . Nous examinerons votre préoccupation dans les plus brefs délais.',
          });

          // Redirection vers la page d'accueil après 2 secondes
          // setTimeout(() => {
          //   this.router.navigate(['/accueil']); // Remplacez '/accueil' par le chemin de votre page d'accueil
          // }, 3000);
        },
        (error) => {
          console.error('Erreur lors de la soumission du contact:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la soumission de votre préoccupation !',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez entrer une préoccupation valide !',
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.contactForm.patchValue({
      attachment: file,
    });
  }
}
