import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeRefreshService {
  private refreshSubject = new Subject<void>();

  refreshHome$ = this.refreshSubject.asObservable();

  constructor() { }

  triggerRefresh() {
    this.refreshSubject.next();
  }

}
