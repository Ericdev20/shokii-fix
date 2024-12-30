import { Component } from '@angular/core';
import { AuthService } from '../core/_services/auth.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['../../assets/css/globale.css'],
})
export class FooterComponent {
  isLoggedIn = false;
  date: any;
  private socket: any;

  ngOnInit() {
    this.date = moment(new Date()).format('YYYY');
    // console.log(moment(new Date()).format('YYYY'));
  }
  constructor(private router: Router, private authService: AuthService) {
    this.authService.isAuthenticated.subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated;
    });
    this.socket = io(environment.nodeUrl);
  }
  public logout(): void {
    const pseudo = localStorage.getItem('pseudo');
    const id = localStorage.getItem('id');
    this.socket.emit('disconnected', id);
    this.authService.logout();
    // this.ngOnDestroy() ;
    this.router.navigate(['/']);
    // window.location.href = '/';

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
      title: 'A très vite ' + pseudo + '😎😎..',
    });
  }
}
