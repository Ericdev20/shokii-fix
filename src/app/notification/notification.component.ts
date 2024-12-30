import { Component, OnInit } from '@angular/core';
import { messaging } from '../../configs/firebase.config';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-notification',
  // standalone: true,
  // imports: [],
  template: '',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  ngOnInit(): void {
    this.requestPermission();
    this.listen();
  }

  requestPermission() {
    messaging
      .getToken({ vapidKey: environment.firebaseConfig.vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          console.log(currentToken);
        } else {
          console.log(
            'No registration token available. Request permission to generate one.'
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  listen() {
    messaging.onMessage((incomingMessage) => {
      console.log(incomingMessage);
    });
  }
}
