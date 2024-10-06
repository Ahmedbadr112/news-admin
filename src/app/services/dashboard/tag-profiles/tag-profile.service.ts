import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
} from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { TagProfilesHTTPService } from './tag-profiles-http/tag-profiles-http.service';

@Injectable({
  providedIn: 'root',
})
export class TagProfilesService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private authService: AuthService,
    private tagProfileHTTPService: TagProfilesHTTPService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  getTagProfiles(pageNumber: number, search?: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.tagProfileHTTPService
      .getTagProfiles(auth.authToken, pageNumber, search)
      .pipe(
        map((data) => {
          return data.data;
        }),
        catchError((err) => {
          console.error('err', err);
          throw err;
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }
}
