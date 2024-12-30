import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  newMessageCount!: number;
  constructor() {}
  private newMessageCountSubject = new Subject<number>();
  newMessageCount$ = this.newMessageCountSubject.asObservable();

  updateNewMessageCount(count: number): number {
    this.newMessageCount = count;
    return this.newMessageCount; // Renvoyer la nouvelle valeur du compteur
  }
}
