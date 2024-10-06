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
import { NewsStatusHTTPService } from './news-status-http/news-status-http.service';

@Injectable({
  providedIn: 'root',
})
export class NewsStatusService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private authService: AuthService,
    private newsStatusHTTPService: NewsStatusHTTPService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  getNews(
    pageNumber: number,
    search?: string,
    statusId?: string,
    categoryId?: string,
    subCategoryId?: string
  ) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.newsStatusHTTPService
      .getNews(
        auth.authToken,
        pageNumber,
        search,
        statusId,
        categoryId,
        subCategoryId
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
}
