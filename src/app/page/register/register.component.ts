import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { AuthService } from 'src/app/core/_services/auth.service';
import { Masculin } from 'src/app/_utilities/interfaces/profil/masculin';
import { DatePipe } from '@angular/common';
import { Feminin } from 'src/app/_utilities/interfaces/profil/Feminin';
import { of } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { UtilitiesService } from 'src/app/core/_services/utilities.service';
import { villes } from 'src/app/_utilities/villes-data';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import intlTelInput from 'intl-tel-input';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', animate('1500ms ease-in-out')),
    ]),
  ],
})
export class RegisterComponent implements OnInit, AfterViewChecked {
  @ViewChild('content', { static: true }) contentRef!: ElementRef;
  @ViewChild('content1', { static: true }) contentRef1!: ElementRef;
  @ViewChild('verificationModal', { static: true }) contentRef2!: ElementRef;
  @ViewChild('phoneInput') phoneInput!: ElementRef;
  @ViewChild('otp1', { static: false }) otp1!: ElementRef;
  @ViewChild('stepper')
  stepper!: MatStepper;

  //initialisation
  /* private url = environment.nodeUrl;

  private socket!: Socket;*/
  secondFormGroup: any;
  firstFormGroup: any;
  thirdFormGroup: any;
  emailForm: any;
  villes: any;
  emailExists: boolean = false;
  imageUrl: string | null = null;
  imageSelected = false;
  gallery: any = [];
  visibility: any = [];
  selectedValue!: string;
  isMasculin: boolean = true;
  // isMasculin: boolean = false;
  showButtons: boolean = false;
  stepMat: boolean = false;
  phone_number!: string;
  photoProfil: any;
  role: any = 2;
  id: any;
  descriptions: any;
  showPart1 = true;
  // showPart1 = false;
  motif: any = '';
  dateError: boolean = false;
  fileChoose: any = [];
  visible = 1;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileCropped: File | null = null; // Ajoutez une propriété pour stocker le fichier recadré
  email: string = '';
  emailTake!: boolean;
  code: string[] = ['', '', '', '', '', '', '', ''];
  token!: any;
  currentStep: number = 1; // initial step
  iti: any;
  isEditable = true;
  minDate: any;
  whatsApp: any;
  stepIndex: any = 0;
  firstFormFieldLabels!: any;
  secondFormFieldLabels!: any;
  thirdFormFieldLabels: {
    teint: string;
    cheveux: string;
    poids: string;
    taille: string;
    description: string;
    body: string;
  };

  constructor(
    private authService: AuthService,
    private _formBuilder: FormBuilder,
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private utilitiesService: UtilitiesService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {
    /*Etape 1 :   */

    this.firstFormGroup = this._formBuilder.group({
      pseudo: ['', [Validators.required, this.pseudoValidator]],
      parrain: [''],
      statut: [''],
      naissance: ['', Validators.required],
      ville: [],
    });

    this.firstFormFieldLabels = {
      pseudo: 'Pseudo',
      parrain: 'Parrain',
      statut: 'Statut',
      naissance: 'Date de naissance',
      ville: 'Ville',
    };
    /*Etape 2 :   */
    this.secondFormGroup = this._formBuilder.group(
      {
        nom: [''],
        prenom: [''],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        photoProfil: [''],
        whatsapp: [''],
        whatsapp_number: [''],
        termsAndConditions: ['', [Validators.requiredTrue]],
        privacyPolicy: ['', [Validators.requiredTrue]],
      },
      { validator: this.passwordMatchValidator }
    );
    this.secondFormFieldLabels = {
      nom: 'Nom',
      prenom: 'Prénom',
      password: 'Mot de passe',
      confirmPassword: 'Confirmation du mot de passe',
      photoProfil: 'Photo de profil',
      whatsapp: 'WhatsApp',
      whatsapp_number: 'Numéro WhatsApp',
      termsAndConditions: 'Conditions générales',
      privacyPolicy: 'Politique de confidentialité',
    };

    /*Etape 3*/

    this.thirdFormGroup = this._formBuilder.group({
      teint: [''],
      cheveux: [''],
      poids: [''],
      taille: [''],
      description: ['', Validators.required],
      body: ['', Validators.required],
    });
    this.thirdFormFieldLabels = {
      teint: 'Teint',
      cheveux: 'Cheveux',
      poids: 'Poids',
      taille: 'Taille',
      description: 'Description',
      body: 'Corpulence',
    };

    if (localStorage.getItem('sexe') === '3') {
      this.isMasculin = false;
      this.setStatus('F');
    } else if (localStorage.getItem('sexe') === '2') {
      this.isMasculin = true;
      this.setStatus('M');
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.initializeTelInput();
      }
    });
    this.villes = villes;
    const today = new Date();
    const minYear = today.getFullYear() - 18;
    const minMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const minDay = today.getDate().toString().padStart(2, '0');

    this.minDate = `${minYear}-${minMonth}-${minDay}`;

    const city = this.firstFormGroup?.get('ville');
    city?.setValidators(Validators.required);

    this.emailForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.gmailValidator]],
    });
  }

  ngOnInit() {
    this.whatsAppUpdate();
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/accueil']);
    }
    this.route.queryParams.subscribe((params) => {
      if (!params['phoneNumber']) {
        this.router.navigate(['/signup']);
      } else {
        this.phone_number = params['phoneNumber'];
        if (
          localStorage.getItem('part') !== '2' ||
          localStorage.getItem('email') === ''
        ) {
          this.showPart1 = true;
        } else {
          this.showPart1 = false;
        }
      }
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.phoneInput) {
        this.iti = intlTelInput(this.phoneInput.nativeElement, {
          separateDialCode: false,
          initialCountry: 'BJ',
          utilsScript:
            'https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.19/build/js/utils.js',
        });
      }
    }, 0);
  }
  ngAfterViewChecked() {
    if (this.phoneInput && !this.iti) {
      this.iti = intlTelInput(this.phoneInput.nativeElement, {
        separateDialCode: false,
        initialCountry: 'BJ',
        utilsScript:
          'https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.19/build/js/utils.js',
      });
    }
  }

  pseudoValidator(control: AbstractControl): ValidationErrors | null {
    const valid = /^[a-zA-Z0-9À-ÖØ-öø-ÿ]+$/.test(control.value);
    return valid ? null : { invalidPseudo: true };
  }
  loadDescription() {
    this.utilitiesService.textesDescription().subscribe(
      (res: any) => {
        // console.log('text récupére', res);
        this.descriptions = res;
        // res.forEach((ani: any) => {
        //   this.anim.push(ani.texte)
        // });
        // console.log('text' ,this.anim)
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des informations  :',
          error
        );
      }
    );
  }
  gobackToMail() {
    this.showPart1 = true;
    this.currentStep = 3;
  }

  gmailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const email: string = control.value.trim();
    const isGmail = email.toLowerCase().endsWith('@gmail.com');
    return isGmail ? null : { invalidGmail: true };
  }

  goToPart2(motif?: any) {
    this.motif = motif;
    // this.showPart1 = false;
    this.emailTake = true;
    // console.log('showPart2 actualisé', this.showPart1);
    this.currentStep = 3;
  }
  hide = true;
  //choix du corpulence ...
  onRadioChange(value: string) {
    const radios = document.querySelectorAll('.radio');
    radios.forEach((radio) => {
      radio.addEventListener('click', () => {
        radios.forEach((r) => r.classList.remove('selected'));
        radio.classList.add('selected');
        const value = radio.getAttribute('data-value');
        this.thirdFormGroup.get('body')?.setValue(value);
      });
    });
  }

  updatebody(bodyValue: string) {
    this.thirdFormGroup.get('body')?.setValue(bodyValue);
  }

  //Suppression des validations pour les profils masculin
  public setStatus(choix: string = '') {
    const stat = this.firstFormGroup?.get('statut');
    const profil = this.secondFormGroup?.get('photoProfil');
    const term = this.secondFormGroup?.get('termsAndConditions');
    const policy = this.secondFormGroup?.get('privacyPolicy');

    this.isMasculin = choix === 'M';
    this.currentStep = 2;
    if (choix === 'F') {
      this.role = 3;

      profil?.setValidators(Validators.required);
      term?.clearValidators();
      policy?.clearValidators();
      if (this.motif === 'fun') {
        stat?.setValidators(Validators.required);
      } else {
        stat?.clearValidators();
      }
      this.loadDescription();
    } else if (choix === 'M') {
      this.role = 2;
      stat?.clearValidators();
      profil?.clearValidators();
      term?.setValidators(Validators.requiredTrue);
      policy?.setValidators(Validators.requiredTrue);
    }
    stat?.updateValueAndValidity();
    profil?.updateValueAndValidity();
    policy?.updateValueAndValidity();
    term?.updateValueAndValidity();
  }
  /* step 2 */

  /*password confirm */
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  // /* profil picture choose*/
  profils = [
    {
      imageSelected: false,
      imageUrl: '',
      fileInput: null,
    },
  ];
  //5 others pic
  boxes = [
    {
      imageSelected: false,
      imageUrl: '',
      fileInput: null,
    },
    {
      imageSelected: false,
      imageUrl: '',
      fileInput: null,
    },
    {
      imageSelected: false,
      imageUrl: '',
      fileInput: null,
    },
    {
      imageSelected: false,
      imageUrl: '',
      fileInput: null,
    },
    {
      imageSelected: false,
      imageUrl: '',
      fileInput: null,
    },
  ];
  //profil file function choose

  onFileSelected1(event: any, profil: any) {
    const file = event.target.files[0];
    const maxSizeInBytes = 1.5 * 1024 * 1024;

    if (file) {
      if (file.size <= maxSizeInBytes) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (e.target && e.target.result) {
            profil.imageSelected = false;
            profil.imageUrl = e.target.result;
            profil.fileInput = file;
            // this.photoProfil = file;
            this.fileChoose = profil;
            this.openModal(this.contentRef1, event);
          } else {
            console.error('Erreur de lecture du fichier.');
            Swal.fire({
              icon: 'warning',
              title: 'Erreur de lecture du fichier.',
              text: "Veuillez changer d'image les champs et reessayez ...",
              confirmButtonText: 'OK',
            });
          }
        };

        reader.readAsDataURL(file);
      } else {
        console.error('La taille du fichier dépasse la limite autorisée.');
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "La taille de l'image dépasse la limite autorisée (1.5 MB). Merci de changer d'image et de réésayer",
          confirmButtonText: 'OK',
        });
      }
    }
  }

  // onFileSelected1(event: any, profil: any) {
  //   const file = event.target.files[0];

  //   if (file) {
  //     this.resizeImage(file, 800, 600, (resizedFile: File) => {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         if (e.target && e.target.result) {
  //           profil.imageSelected = false;
  //           profil.imageUrl = e.target.result;
  //           profil.fileInput = resizedFile;
  //           this.fileChoose = profil;
  //           this.openModal(this.contentRef1, event);
  //         } else {
  //           console.error('Erreur de lecture du fichier.');
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Erreur de lecture du fichier.',
  //             text: "Veuillez changer d'image les champs et reessayez ...",
  //             confirmButtonText: 'OK',
  //           });
  //         }
  //       };

  //       reader.readAsDataURL(resizedFile);
  //     });
  //   }
  // }

  // resizeImage(
  //   file: File,
  //   maxWidth: number,
  //   maxHeight: number,
  //   callback: (resizedFile: File) => void
  // ) {
  //   const reader = new FileReader();

  //   reader.onload = (readerEvent: any) => {
  //     const img = new Image();
  //     img.onload = () => {
  //       const canvas = document.createElement('canvas');
  //       let width = img.width;
  //       let height = img.height;

  //       if (width > height) {
  //         if (width > maxWidth) {
  //           height *= maxWidth / width;
  //           width = maxWidth;
  //         }
  //       } else {
  //         if (height > maxHeight) {
  //           width *= maxHeight / height;
  //           height = maxHeight;
  //         }
  //       }

  //       canvas.width = width;
  //       canvas.height = height;

  //       const ctx = canvas.getContext('2d');
  //       ctx?.drawImage(img, 0, 0, width, height);

  //       canvas.toBlob((blob: any) => {
  //         const resizedFile = new File([blob], file.name, {
  //           type: 'image/jpeg',
  //           lastModified: Date.now(),
  //         });
  //         callback(resizedFile);
  //       }, 'image/jpeg');
  //     };
  //     img.src = readerEvent.target.result;
  //   };

  //   reader.readAsDataURL(file);
  // }

  //filles choose for gallery
  onFileSelected2(event: any, profil: any) {
    const maxSizeInBytes = 1.5 * 1024 * 1024;
    const file = event.target.files[0];
    if (file.size <= maxSizeInBytes) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // profil.imageSelected = true;
        profil.imageUrl = e.target.result;
        profil.fileInput = file;
        // this.gallery.push(file);
        this.fileChoose = profil;
        this.openModal(this.contentRef, event);
      };

      reader.readAsDataURL(file);
    } else {
      console.error('La taille du fichier dépasse la limite autorisée.');
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "La taille de l'image dépasse la limite autorisée (1.5 MB).Merci de changer d'image et de réésayer",
        confirmButtonText: 'OK',
      });
    }
  }

  removeImage(formControl: AbstractControl<any, any> | null, box: any) {
    box.imageSelected = false;
    box.fileInput = null;
    box.imageUrl = '';
    formControl?.patchValue('');
  }
  //image cropping

  /*
description
*/
  /*descriptions = [
    'Je suis une personne aventureuse qui cherche à explorer de nouveaux plaisirs sans lendemain avec des partenaires passionnés.',
    "Je suis ouvert d'esprit et à la recherche d'un(e) partenaire qui veut vivre des moments intenses sans s'engager dans une relation sérieuse.",
    "Je suis quelqu'un de passionné et j'aime les rencontres sans tabou où les désirs sont explorés sans retenue.",
    'Je cherche des rencontres sans lendemain pour des moments de plaisir intense avec des personnes ayant la même vision de la sexualité que moi.',
    "Je suis à la recherche d'un(e) partenaire passionné(e) pour explorer ensemble des fantasmes et des plaisirs sans limites.",
    "Je suis un(e) aventurier(ère) à la recherche d'une expérience sexuelle passionnée et sans engagement avec un(e) partenaire qui partage cette même envie.",
    'Autres ...',
  ];*/

  //body weigth choose

  /*Etape 3*/

  fourthFormGroup = this._formBuilder.group({
    album0: [''],
    album1: [''],
    album2: [''],
    album3: [''],
    album4: [''],
    termsAndConditions: ['', [Validators.requiredTrue]],
    privacyPolicy: ['', [Validators.requiredTrue]],
  });

  test() {
    this.stepMat = true;
    if (!this.isMasculin) {
      Swal.fire({
        title: 'Verifier votre identité !',
        text: "Un contrôle d'identité par la reconnaissance faciale est requis!",
        icon: 'question',
        backdrop: 'static',

        showCancelButton: true,
        confirmButtonText: 'Commencer',
        cancelButtonText: 'Plus tard',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = 'verification.shokii.com';
          // L'utilisateur a cliqué sur "Commencer"
          // Ajoutez ici le code à exécuter lorsque l'utilisateur clique sur "Commencer"
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // L'utilisateur a cliqué sur "Plus tard"
          // Ajoutez ici le code à exécuter lorsque l'utilisateur clique sur "Plus tard"
          this.router.navigate(['login']);
        }
      });
      this.router.navigate(['login']);
    } else {
    }
  }

  RegisterY() {
    if (!this.secondFormGroup.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez remplir correctemment tous les champs ',
        confirmButtonText: "OK,c'est compris.",
      });
      return;
    } else {
      if (this.iti) {
        const internationalNumber = this.iti;
        const ident = internationalNumber.selectedCountryData.dialCode;
        if (this.secondFormGroup.value.whatsapp) {
          this.whatsApp =
            '+' + ident + this.secondFormGroup.value.whatsapp_number;
        }
      }

      const email = this.emailForm.value.email
        ? this.emailForm.value.email
        : localStorage.getItem('email');
      const motif = this.motif ? this.motif : localStorage.getItem('motif');
      const role = this.role ? this.role : localStorage.getItem('sexe');
      const ville: any = this.firstFormGroup.value.ville;
      const localisation: string = ville ? ville : '';

      const dateNaissance: string = this.firstFormGroup.value.naissance
        ? this.firstFormGroup.value.naissance
        : '';

      const Data: Masculin = {
        name: this.secondFormGroup.value.nom,
        prenom: this.secondFormGroup.value.prenom,
        email: email,
        date_naissance: this.formatDate(dateNaissance),
        photoProfil: this.photoProfil,
        pseudo: this.firstFormGroup.value.pseudo,
        parrain: this.firstFormGroup.value.parrain,
        password: this.secondFormGroup.value.password,
        phone_number: this.phone_number,
        localisation: localisation,
        whatsapp_allowed: this.secondFormGroup.value.whatsapp,
        whatsapp_number: this.whatsApp,
        role_id: role,
        account_type: motif,
      };
      const formData = new FormData();
      formData.append('name', Data.name || '');
      formData.append('prenom', Data.prenom || '');
      formData.append('email', Data.email || '');
      formData.append('photoProfil', Data.photoProfil || '');
      formData.append('date_naissance', Data.date_naissance || '');
      formData.append('pseudo', Data.pseudo || '');
      formData.append('password', Data.password || '');
      formData.append('phone_number', Data.phone_number || '');
      formData.append('localisation', Data.localisation || '');
      formData.append('role_id', Data.role_id || '');
      formData.append('whatsapp_number', Data.whatsapp_number || '');
      formData.append('whatsapp_allowed', Data.whatsapp_allowed || false);
      formData.append('account_type', Data.account_type || '');
      formData.append('parrain', Data.parrain || '');

      this.authService.register(formData).subscribe(
        (response) => {
          localStorage.clear(); // Efface tout le stockage local
          const notifKey = 'newU' + response.user; // Assurez-vous que `response.user` contient un ID valide
          if (response.kiss_credit) {
            localStorage.setItem(notifKey, '1'); // Définit la notification pour l'utilisateur
          }

          Swal.fire({
            icon: 'success',
            title: 'Compte créé avec succès',
            text: 'Veuillez vous connecter ...',
            confirmButtonText: 'OK',
          }).then(() => {
            this.router.navigate(['login']);
          });
        },
        (error) => {
          console.error(error);
          if (error.error.errorType === 'mailphone') {
            Swal.fire({
              icon: 'error',
              title: "Echec d'inscription.",
              text: error.error.message,
              confirmButtonText: 'OK',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erreur création de compte ',
              text: "Erreur lors de la création de compte . Réesayez et si l'erreur persiste Veuillez contacter le service administratif.",
              confirmButtonText: 'OK',
            });
          }
        }
      );

      // this.router.navigate(['login']);
    }
  }
  formatDate(dateString: string): string {
    const dateObj = new Date(dateString);

    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const day = ('0' + dateObj.getDate()).slice(-2);

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  checkMail() {
    const email = this.emailForm.value.email;
    if (email) {
      this.authService.checkEmail(email).subscribe(
        (response) => {
          if (response.success) {
            // this.emailExists = false;
            this.showPart1 = false;
            // console.log('email disponible');
          } else {
            // console.log('Email already exists:', response.email);
            Swal.fire({
              icon: 'error',
              title: 'Email déjà pris.',
              text: 'Cette adresse e-mail est déjà utilisée par un autre utilisateur.',
            });
            this.emailExists = true;
          }
        },
        (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: "Erreur lors de la vérification de l'email.",
            text: "Une erreur s'est produite lors de la vérification de l'email. Veuillez réessayer plus tard.",
          });
        }
      );
    }
    // console.log('emailExists', this.emailExists);
  }

  checkMailOld() {
    const email = this.emailForm.value.email;
    if (email) {
      this.authService.checkEmail(email).subscribe(
        (response) => {
          if (response.success) {
            // this.emailExists = false;
            this.showPart1 = false;
            // console.log('email disponible');
          } else {
            // console.log('Email already exists:', response.email);
            Swal.fire({
              icon: 'error',
              title: 'Email déjà pris.',
              text: 'Cette adresse e-mail est déjà utilisée par un autre utilisateur.',
            });
            this.emailExists = true;
          }
        },
        (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: "Erreur lors de la vérification de l'email.",
            text: "Une erreur s'est produite lors de la vérification de l'email. Veuillez réessayer plus tard.",
          });
        }
      );
    }
    // console.log('emailExists', this.emailExists);
  }
  checkPseudo() {
    const pseudo = this.firstFormGroup.get('pseudo');
    // console.log(pseudo?.value);
    if (pseudo?.value) {
      this.authService.checkPseudo(pseudo?.value).subscribe(
        (response) => {
          if (response.success) {
            // console.log('pseudo disponible');
          } else {
            // console.log('pseudo already exists:', response.pseudo);
            Swal.fire({
              icon: 'error',
              title: 'Pseudo déjà pris.',
              text: 'Ce Pseudo est déjà utilisé par un autre utilisateur.',
            });
          }
        },
        (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur lors de la vérification du pseudo.',
            text: "Une erreur s'est produite lors de la vérification du Pseudo. Veuillez réessayer plus tard.",
          });
        }
      );
    }
  }

  check() {
    if (!this.secondFormGroup?.get('photoProfil')?.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Vous devez définir une photo de profil...',
        confirmButtonText: 'OK',
      });
    } else if (this.secondFormGroup.invalid) {
      const invalidFields: string[] = [];
      const controls = this.secondFormGroup.controls;

      for (const name in controls) {
        if (controls[name as keyof typeof controls].invalid) {
          const label =
            this.secondFormFieldLabels[
              name as keyof typeof this.secondFormFieldLabels
            ] || name;
          invalidFields.push(label);
        }
      }

      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        html: `Veuillez remplir correctement ce(s) champ(s) avant de continuer : <br><br><b><li>${invalidFields.join(
          ', <li>'
        )}</b>`,
        confirmButtonText: 'OK',
      });
      return;
    } else {
      // Votre logique supplémentaire ici
    }
  }

  RegisterX() {
    if (!this.fourthFormGroup.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: "Veuillez accepter nos conditions d'utilisations et la politique de confidentialité  ...",
        confirmButtonText: 'OK',
      });
      return;
    } else {
      if (this.iti) {
        const internationalNumber = this.iti;
        const ident = internationalNumber.selectedCountryData.dialCode;
        if (this.secondFormGroup.value.whatsapp) {
          this.whatsApp =
            '+' + ident + this.secondFormGroup.value.whatsapp_number;
        }
      }

      const email = this.emailForm.value.email
        ? this.emailForm.value.email
        : localStorage.getItem('email');
      const motif = this.motif ? this.motif : localStorage.getItem('motif');
      const role = this.role ? this.role : localStorage.getItem('sexe');

      const ville: any = this.firstFormGroup.value.ville;
      const localisation: string = ville ? ville : '';
      const dateNaissance: string = this.firstFormGroup.value.naissance
        ? this.firstFormGroup.value.naissance
        : '';

      const Data: Feminin = {
        name: this.secondFormGroup.value.nom,
        prenom: this.secondFormGroup.value.prenom,
        email: email,
        date_naissance: this.formatDate(dateNaissance),
        photoProfil: this.photoProfil,
        pseudo: this.firstFormGroup.value.pseudo,
        password: this.secondFormGroup.value.password,
        phone_number: this.phone_number,
        localisation: localisation,
        role_id: role,
        description: this.thirdFormGroup.value.description,
        poids: this.thirdFormGroup.value.poids,
        taille: this.thirdFormGroup.value.taille,
        corpulence: this.thirdFormGroup.value.body,
        cheveux: this.thirdFormGroup.value.cheveux,
        teint: this.thirdFormGroup.value.teint,
        verify_profil: 0,
        status_id: this.firstFormGroup.value.statut,
        whatsapp_allowed: this.secondFormGroup.value.whatsapp,
        whatsapp_number: this.whatsApp,
        account_type: motif,
        parrain: this.firstFormGroup.value.parrain,
      };

      const formData = new FormData();
      formData.append('name', Data.name || '');
      formData.append('prenom', Data.prenom || '');
      formData.append('email', Data.email || '');
      formData.append('photoProfil', Data.photoProfil || '');
      formData.append('date_naissance', Data.date_naissance || '');
      formData.append('pseudo', Data.pseudo || '');
      formData.append('password', Data.password || '');
      formData.append('phone_number', Data.phone_number || '');
      formData.append('localisation', Data.localisation || '');
      formData.append('role_id', Data.role_id || '');
      formData.append('description', Data.description || '');
      formData.append('poids', Data.poids || '');
      formData.append('taille', Data.taille || '');
      formData.append('corpulence', Data.corpulence || '');
      formData.append('cheveux', Data.cheveux || '');
      formData.append('teint', Data.teint || '');
      formData.append('verify_profil', String(Data.verify_profil) || '');
      formData.append('whatsapp_number', Data.whatsapp_number || '');
      formData.append('whatsapp_allowed', Data.whatsapp_allowed || false);
      formData.append('account_type', Data.account_type || '');
      formData.append('parrain', Data.parrain || '');

      if (Data.status_id !== '') {
        formData.append('status_id', Data.status_id || '');
      } else {
        formData.append('status_id', '1');
      }

      if (this.gallery.length !== 0) {
        for (let i = 0; i < this.gallery.length; i++) {
          const file = this.gallery[i];
          const visible = this.visibility[i];
          formData.append('files[]', file);
          formData.append('visibility[]', visible);
        }
      }

      this.authService.register(formData).subscribe(
        (response) => {
          // console.log('compte créé', response);
          this.id = response.user;
          localStorage.clear();

          Swal.fire({
            icon: 'success',
            title: 'Compte créé avec succès',
            text: 'Veuillez vous connecter ...',
            confirmButtonText: 'OK',
          }).then(() => {
            this.stepMat = true;

            Swal.fire({
              title: 'Verifier votre identité !',
              text: "Un contrôle d'identité par la reconnaissance faciale est requis!",
              icon: 'question',
              backdrop: 'static',

              showCancelButton: true,
              confirmButtonText: 'Commencer',
              cancelButtonText: 'Plus tard',
              confirmButtonColor: '#d63384',
            }).then((result) => {
              if (result.isConfirmed) {
                window.open(
                  'https://verification.shokii.com/?id=' + this.id,
                  '_blank'
                );
              } else {
                this.router.navigate(['login']);
              }
            });
          });
        },
        (error) => {
          console.error(error);
          if (error.status === 500) {
            Swal.fire({
              icon: 'error',
              title: "Echec d'inscription.",
              text: 'Verifiez tous les champs et reessayez ...',
              confirmButtonText: 'OK',
            });
          } else if (error.error.errorType === 'mailphone') {
            Swal.fire({
              icon: 'error',
              title: "Echec d'inscription.",
              text: error.error.message,
              confirmButtonText: 'OK',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: "Echec d'inscription.",
              text: 'Service indisponible . Ressayez plus tard ...',
              confirmButtonText: 'OK',
            });
          }
        }
      );
    }
  }
  subform1() {
    if (this.firstFormGroup.invalid) {
      const invalidFields: string[] = [];
      const controls = this.firstFormGroup.controls;
      for (const name in controls) {
        if (controls[name as keyof typeof controls].invalid) {
          invalidFields.push(name);
        }
      }

      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        html: `Veuillez remplir correctement tous les champs avant de continuer. Les champs suivants sont invalides : <br><br><b><li>${invalidFields.join(
          ', <li>'
        )}</b>`,
        confirmButtonText: 'OK',
      });
      return;
    } else {
    }
  }
  subform2() {
    if (this.thirdFormGroup.invalid) {
      const invalidFields: string[] = [];
      const controls = this.thirdFormGroup.controls;

      for (const name in controls) {
        if (controls[name as keyof typeof controls].invalid) {
          const label =
            this.thirdFormFieldLabels[
              name as keyof typeof this.thirdFormFieldLabels
            ] || name;
          invalidFields.push(label);
        }
      }

      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        html: `Veuillez remplir correctement tous les champs avant de continuer. Les champs suivants sont invalides : <br><br><b><li>${invalidFields.join(
          ', <li>'
        )}</b>`,
        confirmButtonText: 'OK',
      });
      return;
    } else {
      // Logique supplémentaire ici
    }
  }

  calculateAge(birthdate: any): number {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  valideDate() {
    const birthDateValue = this.firstFormGroup.get('naissance')?.value;
    if (!birthDateValue) {
      this.dateError = true;
      return;
    }

    const birthDate = new Date(birthDateValue);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    this.dateError = age < 18;
  }
  openModal(content: any, event: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-title' });
    this.imageChangedEvent = event;
  }
  closePopup() {
    this.modalService.dismissAll();
  }
  setVisibility(file: any) {
    // arg0.visibility = this.visible;
    this.gallery.push(file.fileInput);
    file.imageSelected = true;
    // console.log(this.gallery);
    this.visibility.push(this.visible);
    // console.log('Visibility', this.visibility);
    this.closePopup();
  }
  cancelChoose(file?: any) {
    if (file) {
      file.imageSelected = false;
      file.fileInput = null;
      file.imageUrl = '';
    }
    this.photoProfil = '';
    this.closePopup();
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event && event.base64) {
      let base64Data = event.base64 as string;
      let file = this.base64ToFile(base64Data, 'cropped_image.png');
      if (file) {
        this.fileCropped = file;
        this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(base64Data);
      } else {
        console.error('Impossible de convertir les données Base64 en fichier.');
      }
    } else {
      console.error('Données Base64 non définies.');
    }
  }
  base64ToFile(data: string, filename: string): File | null {
    if (!data || !filename) {
      return null;
    }

    const base64Parts = data.split(',');
    if (base64Parts.length !== 2) {
      console.error('Invalid base64 data');
      return null;
    }

    const byteCharacters = atob(base64Parts[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    return new File([blob], filename, { type: 'image/png' });
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  savePP() {
    this.profils[0].imageUrl = this.croppedImage;
    this.profils[0].imageSelected = true;
    this.photoProfil = this.fileCropped;
    this.closePopup();
  }
  codeSend() {
    const mail = this.emailForm.value.email || '';
    // this.authService.verifyRegisterMail(mail).subscribe(
    //   (response) => {
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'code de verification envoyé',
    //       html:
    //         "Un code à usage unique a été envoyé à l'adresse " +
    //         mail +
    //         '<b> (vérifiez vos spams si nécessaire) </b>.',
    //       showConfirmButton: true,
    //     }).then(() => {
    //       this.openVerificationModal();
    //     });

    //     // Naviguer vers la route /verify

    //     //   this.router.navigate(['/accueil']);
    //     /*     this.router.navigate(['/verify'], {
    //       queryParams: { phoneNumber: phoneNumber },
    //     }); */
    //   },
    //   (error) => {
    //     if (error.status == 500) {
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Veuillez entrez un email valide !',
    //         showConfirmButton: true,
    //       });
    //     } else if (error.status == 401) {
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Cet e-mail est déjà pris par un autre utilisateur ...',
    //         showConfirmButton: true,
    //       });
    //     } else {
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Connexion impossible . Veuillez réesayer plus tard ...',
    //         showConfirmButton: true,
    //       });
    //     }
    //     // Gestion des erreurs de l'appel API
    //     console.error("Status de l'Erreur lors du login :", error.status);
    //   }
    // );
    this.showPart1 = false;
    localStorage.setItem('part', '2');
    localStorage.setItem('email', this.emailForm.value.email);
    localStorage.setItem('motif', this.motif);
    localStorage.setItem('sexe', this.role);
  }

  openVerificationModal() {
    this.closePopup();
    this.modalService.open(this.contentRef2, {
      ariaLabelledBy: 'modal-title',
      backdrop: 'static', // Appliquer un fond statique
    });

    setTimeout(() => {
      if (this.otp1) {
        this.otp1.nativeElement.focus();
      } else {
        console.error('otp1 is undefined');
      }
    }, 100);
  }

  verifyCode() {
    this.token = parseInt(this.code.join(''));
    const email = this.emailForm.value?.email;
    // console.log(this.token);
    this.authService.verifyPin(this.token, email).subscribe(
      (response) => {
        if (response.success) {
          // console.log('Code de vérification valide');
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'E-mail Verifié avec succès ...',
            showConfirmButton: false,
            timer: 2000,
          });
          this.closePopup();
          this.showPart1 = false;
          localStorage.setItem('part', '2');
          localStorage.setItem('email', this.emailForm.value.email);
          localStorage.setItem('motif', this.motif);
          localStorage.setItem('sexe', this.role);
        } else {
          // console.log('Code de vérification invalide');
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
    this.codeSend();
    this.code = ['', '', '', '', '', '', '', ''];
  }
  goback1() {
    this.emailTake = false;
  }
  goback0() {
    history.back();
  }
  whatsAppUpdate() {
    this.secondFormGroup
      .get('whatsapp')
      .valueChanges.subscribe((value: any) => {
        const whasappAgree = this.secondFormGroup.get('whatsapp');
        const whasappNumberControl =
          this.secondFormGroup.get('whatsapp_number');
        if (whasappAgree?.value === 'true') {
          whasappNumberControl.setValidators([Validators.required]);
        } else {
          whasappNumberControl.setValue('');
          whasappNumberControl.clearValidators();
        }

        // Mettez à jour la validation
        whasappNumberControl.updateValueAndValidity();
      });
  }

  trimSpaces(event: any): void {
    const trimmedValue = event.target.value.trim();
    this.emailForm.get('email')?.setValue(trimmedValue);
  }
  goBack() {
    this.currentStep = Math.max(1, this.currentStep - 1);
  }

  setGender(gender: string) {
    // save gender and go to next step
    this.currentStep = 2;
  }

  setRelationship(relationship: string) {
    this.motif = relationship;
    this.currentStep = 3;
  }
  checkParrain() {
    const parrain = this.firstFormGroup.get('parrain');
    if (parrain?.value) {
      this.authService.checkParrain(parrain?.value).subscribe(
        (response) => {
          if (response.success) {
            // console.log('code correct');
          } else {
            // console.log('code incorrect:', response);
            // Swal.fire({
            //   icon: 'warning',
            //   title: 'Code invalide.',
            //   text: "Le code de parrainage fourni est invalide .\n \n Vous pouvez toute fois continuer le processus d'inscription sans ce code !",
            // });
          }
        },
        (error) => {
          console.error(error);
          // Swal.fire({
          //   icon: 'error',
          //   title: 'Erreur lors de la vérification du code de parrainage.',
          //   text: "Une erreur s'est produite lors de la vérification du code de parrainage. Veuillez réessayer plus tard.",
          // });
        }
      );
    }
  }
  onSelectionChange(event: any) {
    this.stepIndex = event.selectedIndex;
  }
  private initializeTelInput() {
    if (this.phoneInput) {
      this.iti = intlTelInput(this.phoneInput.nativeElement, {
        separateDialCode: false,
        // initialCountry: 'BJ',
        utilsScript:
          'https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.19/build/js/utils.js',
      });
    }
  }
}
