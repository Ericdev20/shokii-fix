import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from 'src/app/core/_services/shared/user.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { KissService } from 'src/app/core/_services/kiss.service';
import { villes } from 'src/app/_utilities/villes-data';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import 'moment/locale/fr';
import { AuthService } from 'src/app/core/_services/auth.service';
import { UtilitiesService } from 'src/app/core/_services/utilities.service';
import intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: [
    './user-setting.component.scss',
    '../../../assets/css/globale.css',
  ],
})
export class UserSettingComponent {
  @ViewChild('content', { static: true }) contentRef!: ElementRef;
  @ViewChild('phoneInput') phoneInput!: ElementRef;

  profileForm!: FormGroup;
  deleteAccountForm: FormGroup;
  value!: string;
  value1!: string;
  isMasculin!: boolean;
  userLogged: any;
  name: any;
  selectedville!: string;
  passwordForm!: FormGroup;
  villes: any;
  profileImage!: any;
  wallet: any = 0;
  default = environment.defaultImage;
  imgPath: string = environment.imgPath;
  sexe: any;
  ProfilphotoSelected: boolean = false;
  galleries = [];
  verify: any;
  tokenKey: string = 'token';
  user_id: any;
  checkLink: any;
  isOpen = false;
  visible = 1;
  fileChoose: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileCropped: File | null = null;
  profileImageObj: any;
  fileSelected: boolean = true;
  _photoHolder: any;
  validite: any;
  afficherRaison: boolean = false;
  afficherDescription: boolean = false;
  descriptions: any;
  iti: any;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private kissService: KissService,
    private utilitiesService: UtilitiesService,
    private router: Router,
    private elementRef: ElementRef,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.villes = villes;
    this.deleteAccountForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      reason: [''],
    });
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required /* Validators.minLength(6) */]],
      confirmPassword: ['', Validators.required],
    });
    this.profileForm = this.formBuilder.group({
      name: [''],
      prenom: [''],
      pseudo: [''],
      email: [''],
      phone_number: [''],
      localisation: [''],
      description: [''],
      account_type: [''],
      date_naissance: [''],
      taille: [''],
      poids: [''],
      whatsapp_allowed: [''],
      whatsapp_number: [''],
    });
  }

  ngOnInit(): void {
    // Recuperer les information de l'utilisateur connnecté
    this.userService.getUser()?.subscribe(
      (res: any) => {
        // console.log('res', res);

        const user = res.user;
        this.initializeForm(user);
        this.sexe = user.role_id;
        this.isMasculin = this.sexe === 2;
        this.isMasculin ? '' : this.getDescriptionTexte();
        this.verify = user.profil_verify_id;

        this.user_id = user.role_id;

        this.validite = user.wallet?.validite;
        this.wallet =
          user.wallet?.nombreKiss +
          (user.paiements?.reduce(
            (total: any, paiement: { nombreKiss: any }) =>
              total + paiement.nombreKiss,
            0
          ) || 0);

        this.checkLink = 'https://verification.shokii.com?id=' + user.id;

        // Gestion de l'image de profil

        const photoProfil = res?.profil_pic;
        this.profileImage = this.getImageProfil(photoProfil);

        // Gestion des images de la galerie
        const galleries = user.photo_gallery;

        if (galleries) {
          this.galleries = galleries.map((image: any) => ({
            id: image.id,
            imageUrl: `${this.imgPath}${image.path.replace(
              'users_images/',
              ''
            )}`,
          }));

          this.boxes = galleries.map((image: any) => ({
            id: image.id,
            imageSelected: true,
            imageUrl: `${this.imgPath}${image.path.replace(
              'users_images/',
              ''
            )}`,
            fileInput: null,
          }));

          while (this.boxes.length < 5) {
            this.boxes.push({
              id: null,
              imageSelected: false,
              imageUrl: '',
              fileInput: null,
            });
          }
        } else {
          // console.log('Aucune photo de galerie trouvée.');
        }
      },
      (erreur) => {
        console.error(
          "Erreur lors de la récupération des informations de l'utilisateur :",
          erreur
        );
      }
    );
    // const userJSON: string | null = localStorage.getItem('user');
    // if (userJSON !== null) {
    //   const user: {
    //     id: string;
    //     pseudo: string;
    //     role_id: string;
    //     profil_verify_id: string;
    //   } = JSON.parse(userJSON);

    //   const id = user.id;
    //   this.sexe = user.role_id;
    //   this.isMasculin = this.sexe === 2;

    //   this.verify = user.profil_verify_id;
    //   this.user_id = user.role_id;

    //   this.checkLink = 'https://verification.shokii.com?id=' + id;
    // }

    // Initialiser le formulaire avec des valeurs par défaut (avant de récupérer les informations de l'utilisateur)
  }

  getImageProfil(image: string) {
    if (image) {
      const imagePath = image.replace('users_images/', '');
      return `${this.imgPath}${imagePath}`;
    } else {
      return '';
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.phoneInput) {
        this.iti = intlTelInput(this.phoneInput.nativeElement, {
          separateDialCode: false,
          // initialCountry: 'BJ',
          utilsScript:
            'https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.19/build/js/utils.js',
        });
      }
    }, 0);
    $(document).ready(() => {
      //faq

      $('.faq-wrapper .faq-title').on('click', function (e) {
        var element = $(this).parent('.faq-item');
        if (element.hasClass('open')) {
          element.removeClass('open');
          element.find('.faq-content').removeClass('open');
          element.find('.faq-content').slideUp(300, 'swing');
        } else {
          element.addClass('open');
          element.children('.faq-content').slideDown(300, 'swing');
          element
            .siblings('.faq-item')
            .children('.faq-content')
            .slideUp(300, 'swing');
          element.siblings('.faq-item').removeClass('open');
          element
            .siblings('.faq-item')
            .find('.faq-title, .faq-title-two')
            .removeClass('open');
          element
            .siblings('.faq-item')
            .find('.faq-content')
            .slideUp(300, 'swing');
        }
      });
    });
  }
  initializeForm(userData: any) {
    this.profileForm.patchValue({
      name: userData.name,
      prenom: userData.prenom,
      pseudo: userData.pseudo,
      email: userData.email,
      phone_number: userData.phone_number,
      whatsapp_number: userData.whatsapp_number,
      whatsapp_allowed: userData.whatsapp_allowed,
      localisation: userData.localisation,
      description: userData.description,
      description1: userData.description,
      date_naissance: userData.date_naissance,
      taille: userData.taille,
      poids: userData.poids,
      account_type: userData.account_type,
    });
  }
  getDescriptionTexte() {
    this.utilitiesService.textesDescription().subscribe(
      (res: any) => {
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

  galleryForm = this.formBuilder.group({
    album0: [''],
    album1: [''],
    album2: [''],
    album3: [''],
    album4: [''],
  });
  removeImage(
    formControl: AbstractControl<any, any> | null,
    box: any,
    id: number | null
  ) {
    box.imageSelected = false;
    box.imageUrl = '';
    formControl?.patchValue('');

    this.userService.removeImage(id).subscribe(
      (res: any) => {
        // console.log('Image supprimée avec succès', res);
      },
      (error) => {
        console.error("Erreur lors de la suppression de l'image", error);
      }
    );
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const currentPassword = this.passwordForm.value.currentPassword;
      const newPassword = this.passwordForm.value.newPassword;
      const confirmPassword = this.passwordForm.value.confirmPassword;

      if (newPassword !== confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Les deux nouveaux mots de passe ne correspondent pas.',
        });
        return;
      }
      // console.log('newPassword', newPassword);
      // console.log('confirmPassword', confirmPassword);
      // console.log('currentPassword', currentPassword);

      this.userService.changePassword(currentPassword, newPassword)?.subscribe(
        (response: any) => {
          // console.log('Mot de passe modifié avec succès', response);
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Votre mot de passe a été modifié avec succès.',
          });
          this.passwordForm.reset();
        },
        (error) => {
          let msg = '';
          if (error.status == 400) {
            msg = 'Ancien Mot de passe incorrect';
          } else if (error.status == 401) {
            msg = "Erreur d'authenficaton";
          }
          console.error(
            'Erreur lors de la modification du mot de passe',
            error
          );
          // console.log('errorr', error.status);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: msg,
          });
        }
      );
    } else {
      // Gérer les erreurs de validation
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir correctement tous les champs du formulaire.',
      });
    }
  }

  onUpdate(): void {
    if (this.profileForm.valid) {
      if (this.profileForm.value.whatsapp_allowed) {
        if (this.iti) {
          const dialCode = this.iti.getSelectedCountryData().dialCode;
          let phoneNumber = this.profileForm.value.whatsapp_number;

          // Vérifiez que phoneNumber est une chaîne valide avant d'appliquer des modifications
          if (phoneNumber) {
            if (!phoneNumber.startsWith(`+${dialCode}`)) {
              phoneNumber = `+${dialCode}${phoneNumber}`;
            }

            // Mettez à jour le formulaire avec le numéro corrigé
            this.profileForm.patchValue({
              whatsapp_number: phoneNumber,
            });
          } else {
            // Si le numéro est invalide ou nul, désactivez l'option WhatsApp
            this.profileForm.patchValue({
              whatsapp_allowed: 0,
            });
          }
        }
      }

      const formValue = this.profileForm.value;
      this.userService.updateProfile(formValue).subscribe(
        (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Informations mises à jour avec succès',
          }).then(() => {
            // window.location.reload();
            this.ngOnInit();
          });
        },
        (err: any) => {
          console.error('Erreur lors de la mise à jour du profil', err);
          Swal.fire({
            icon: 'error',
            title: 'Service Indisponible',
            text: 'Échec de mise à jour. Veuillez réessayer plus tard.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Échec',
        text: 'Remplissez tous les champs.',
      });
    }
  }

  onDelete(): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer le compte !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.deleteAccountForm.valid) {
          const formValue = this.deleteAccountForm.value;
          this.userService.deleteProfile(formValue).subscribe(
            (res: any) => {
              Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: 'Compte supprimé avec succès.',
              }).then(() => {
                // this.router.navigate(['signup']);

                this.authService.logout();
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                  },
                });

                Toast.fire({
                  icon: 'success',
                  title:
                    'Vous nous manquerez beaucoup ,' +
                    this.profileForm.value.pseudo +
                    ' 😥😥..',
                });
              });
            },
            (err: any) => {
              console.error('Erreur lors de la suppression du compte', err);
              Swal.fire({
                icon: 'error',
                title: 'Echec de suppression',
                text: err.error.error,
              });
            }
          );
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Echec',
            text: "Veillez d'abord entrer votre mot de passe !",
          });
        }
      }
    });
  }

  boxes = [
    {
      id: null,
      imageSelected: false,
      imageUrl: '',
      fileInput: null,
    },
    {
      id: null,
      imageSelected: false,
      imageUrl: '',
      fileInput: null,
    },
    {
      id: null,
      imageSelected: false,
      imageUrl: '',
      fileInput: null,
    },
    {
      id: null,
      imageSelected: false,
      imageUrl: '',
      fileInput: null,
    },
    {
      id: null,
      imageSelected: false,
      imageUrl: '',
      fileInput: null,
    },
  ];

  changeProfilePhoto(event: any) {
    this.fileSelected = false;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // const imgElement = document.querySelector('.pp') as HTMLImageElement;
      // imgElement.src = e.target.result;
      this.openModal(this.contentRef, event);
    };
    reader.readAsDataURL(file);
  }
  updatePP(file: any) {
    this.userService.updateProfilePhoto(file).subscribe(
      (res: any) => {
        this.ProfilphotoSelected = true;
        // console.log('changement de photo de profil ', res);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'La photo de profil a été modifiée avec succès',
        }).then(() => {
          // Recharger la page
          window.location.reload();
        });
      },
      (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Impossible de modifier la photo de profil . Réesayez plus tard . ',
        });
        this.ProfilphotoSelected = false;
        // console.log(err);
      }
    );
  }
  onFileSelected2(event: any, profil: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      profil.imageSelected = true;
      profil.imageUrl = e.target.result;
      profil.fileInput = file;

      this.userService.addMediaToGallery(file).subscribe(
        (res: any) => {
          // console.log('Media ajouté au gallery ', res);
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Image ajouté au gallery avec succès',
          });
        },
        (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Impossible d'ajouter l'image. Réesayez plus tard . ",
          });
          // console.log(err);
        }
      );
    };
    reader.readAsDataURL(file);
  }

  getWallet() {
    this.kissService.getWallet()?.subscribe(
      (res: any) => {
        // console.log('info wallet ', res);
        this.wallet = res.wallet;
      },
      (erreur) => {
        console.error(
          'Erreur lors de la récupération des informations de wallet :',
          erreur
        );
      }
    );
  }
  toggleBox(box: any) {
    box.isOpen = !box.isOpen;
  }
  updateModal() {}

  openModal(content: any, event: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-title' });
    this.imageChangedEvent = event;
  }
  // setVisibility(file: any) {
  //   // arg0.visibility = this.visible;
  //   this.gallery.push(file.fileInput);
  //   file.imageSelected = true;
  // console.log(this.gallery);
  //   this.visibility.push(this.visible);
  // console.log('Visibility', this.visibility);
  //   this.closePopup();
  // }

  // cancelChoose(file?: any) {
  //   if (file) {
  //     file.imageSelected = false;
  //     file.fileInput = null;
  //     file.imageUrl = '';
  //   }
  //   this.photoProfil = '';
  //   this.closePopup();
  // }

  imageCropped(event: ImageCroppedEvent) {
    if (event && event.base64) {
      let base64Data = event.base64 as string;
      let file = this.base64ToFile(base64Data, 'cropped_image.png');
      if (file) {
        this.fileCropped = file;
        this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(base64Data);
        // console.log('Fichier recadré', this.fileCropped);
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
    // this.profils[0].imageUrl = this.croppedImage;
    // this.profils[0].imageSelected = true;
    this.updatePP(this.fileCropped);
    this.ProfilphotoSelected = true;
    this.closePopup();
  }
  cancelChoose(file?: any) {
    this.fileSelected = false;
    this.profileImage = this._photoHolder;
    if (file) {
      file.imageSelected = false;
      file.fileInput = null;
      file.imageUrl = '';
    }
    this.ProfilphotoSelected = false;
    this.closePopup();
  }
  closePopup() {
    this.modalService.dismissAll();
  }
  public formatDateTime(dateTimeStr: string): string {
    const dateMoment = moment(dateTimeStr);
    const formattedDateTime = dateMoment.format('DD MMMM YYYY');
    return formattedDateTime;
  }
  afficherChampRaison() {
    this.afficherRaison = true;
  }
  toggleDescriptionEdit(): void {
    this.afficherDescription = true;
  }

  updateTextAreaValue(value: string): void {
    this.profileForm.get('description')?.setValue(value);
  }

  // toggleDescriptionEdit(): void {
  //   // Récupérez le contrôle du formulaire pour la description
  //   const descriptionControl = this.profileForm.get('description');

  //   // Vérifiez si le contrôle du formulaire est actuellement désactivé
  //   if (descriptionControl !== null) {
  //     // Vérifiez si le contrôle du formulaire est actuellement désactivé
  //     if (descriptionControl.disabled) {
  //       // Activez le champ de texte pour la modification
  //       descriptionControl.enable();
  //       // Obtenez l'élément natif associé au contrôle
  //       const element = this.elementRef.nativeElement.querySelector(
  //         '[formControlName="description"]'
  //       );
  //       // Focus sur l'élément natif pour que l'utilisateur puisse commencer à taper immédiatement
  //       if (element) {
  //         element.focus();
  //       }
  //     } else {
  //       // Désactivez le champ de texte pour arrêter la modification
  //       descriptionControl.disable();
  //     }
  //   }
  // }

  ngAfterViewChecked() {
    if (this.phoneInput && !this.iti) {
      this.iti = intlTelInput(this.phoneInput.nativeElement, {
        separateDialCode: false,
        // initialCountry: 'BJ',
        utilsScript:
          'https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.19/build/js/utils.js',
      });
    }
  }
}
