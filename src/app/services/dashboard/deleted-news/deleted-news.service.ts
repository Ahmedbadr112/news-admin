import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  map,
  of,
} from 'rxjs';
import { DeletedNewsHTTPService } from './deleted-news-http/deleted-news-http.service';

@Injectable({
  providedIn: 'root',
})
export class DeletedNewsService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private authService: AuthService,
    private deletedNewsHTTPService: DeletedNewsHTTPService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  getDeletedNews(
    pageNumber?: number,
    search?: string,
    MainCategoryId?: string,
    SecCategoryId?: string
  ) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.deletedNewsHTTPService
      .getDeletedNews(
        auth.authToken,
        pageNumber,
        search,
        MainCategoryId,
        SecCategoryId
      )
      .pipe(
        map((data) => {
          return data.data;
        }),
        catchError((err) => {
          console.error('err', err);
          return of(undefined);
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  deleteDeletedNew(ids: string[]) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.deletedNewsHTTPService
      .deleteDeletedNew(auth.authToken, ids)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((err) => {
          console.error('err', err);
          return of(undefined);
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }
}
