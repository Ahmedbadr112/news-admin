import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import {
  BehaviorSubject,
  of,
  map,
  catchError,
  finalize,
  Observable,
} from 'rxjs';
import { PublishHTTPService } from './publish-http/publish-http.service';

@Injectable({
  providedIn: 'root',
})
export class PublishService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  rolePassList$: Observable<any[]>;
  rolePassListSubject: BehaviorSubject<any[]>;

  constructor(
    private authService: AuthService,
    private publishHTTPService: PublishHTTPService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();

    this.rolePassListSubject = new BehaviorSubject<any[]>([]);
    this.rolePassList$ = this.rolePassListSubject.asObservable();
  }

  getNewsToPublish(
    search?: string,
    categoryId?: string,
    subCategoryId?: string
  ) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.publishHTTPService
      .getNewsToPublish(auth.authToken, search, categoryId, subCategoryId)
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

  deleteNew(ids: string[]) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.publishHTTPService.deleteNew(auth.authToken, ids).pipe(
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

  publishNews(ids: string[]) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.publishHTTPService.publishNews(auth.authToken, ids).pipe(
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

  returnNews(newsStatus: number, newsIds: string[]) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.publishHTTPService
      .returnNews(auth.authToken, newsStatus, newsIds)
      .pipe(
        map((data) => {
          return data.message;
        }),
        catchError((err) => {
          console.error('err', err);
          return of(undefined);
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }
}
