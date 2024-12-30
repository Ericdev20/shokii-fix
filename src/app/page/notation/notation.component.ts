import { Component } from '@angular/core';
import { UtilitiesService } from 'src/app/core/_services/utilities.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notation',
  templateUrl: './notation.component.html',
  styleUrls: ['../../../assets/css/globale.css', './notation.component.scss'],
})
export class NotationComponent {
  notations: any = [];
  imgPath: string = environment.imgPath;
  averageRating: any = 0;
  starCounts: any = [0, 0, 0, 0, 0, 0];
  totalReviews: any = 0;
  default = environment.defaultProfil;
  role: any;
  profil: any;

  constructor(private utilitiesService: UtilitiesService) {}

  ngOnInit(): void {
    this.utilitiesService.getAllReviews()?.subscribe(
      (res: any) => {
        this.getUserConnected();
        this.notations = res.reviews;
        this.averageRating = res.averageRating.toFixed(1);
        this.starCounts = res.starCounts;
        this.totalReviews = res.totalReviews;

        for (let i = 1; i <= 5; i++) {
          if (!this.starCounts[i]) {
            this.starCounts[i] = 0;
          }
        }
        console.log('this.starCounts', this.starCounts);
      },
      (erreur) => {
        console.error('Erreur lors de la récupération des reviews:', erreur);
      }
    );
  }
  getProgressWidth(star: number): number {
    return this.totalReviews
      ? (this.starCounts[star] / this.totalReviews) * 100
      : 0;
  }
  getImageProfil(image: string) {
    if (image) {
      const imagePath = image.replace('users_images/', '');
      return `${this.imgPath}${imagePath}`;
    } else {
      return '';
    }
  }

  getFilledStarArray(rating: number): any[] {
    return new Array(Math.floor(rating));
  }

  getEmptyStarArray(rating: number): any[] {
    const emptyStars = 5 - Math.ceil(rating);
    return new Array(emptyStars);
  }
  profileLink(memberId: string): string {
    const routePrefix = 'personalInfo-free';
    return `/${routePrefix}/${this.role}/${memberId}/${this.profil}`;
  }
  getUserConnected() {
    const userJSON: string | null = localStorage.getItem('user');
    if (userJSON !== null) {
      const user: {
        id: string;
        pseudo: string;
        role_id: string;
        profil_verify_id: string;
      } = JSON.parse(userJSON);
      const id = user.id;
      this.role = user.role_id;
      this.profil = user.profil_verify_id;
    }
  }
}
