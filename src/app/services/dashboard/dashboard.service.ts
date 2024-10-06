import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  map,
  of,
} from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DashboardHTTPService } from './dashboard-http/dashboard-http.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  categories$: Observable<any[]>;
  categoriesSubject: BehaviorSubject<any[]>;

  contentTypes$: Observable<any[]>;
  contentTypesSubject: BehaviorSubject<any[]>;

  galleryTypes$: Observable<any[]>;
  galleryTypesSubject: BehaviorSubject<any[]>;

  rolePassList$: Observable<any[]>;
  rolePassListSubject: BehaviorSubject<any[]>;

  constructor(
    private authService: AuthService,
    private dashboardHTTPService: DashboardHTTPService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();

    this.categoriesSubject = new BehaviorSubject<any[]>([]);
    this.categories$ = this.categoriesSubject.asObservable();

    this.contentTypesSubject = new BehaviorSubject<any[]>([]);
    this.contentTypes$ = this.contentTypesSubject.asObservable();

    this.galleryTypesSubject = new BehaviorSubject<any[]>([]);
    this.galleryTypes$ = this.galleryTypesSubject.asObservable();

    this.rolePassListSubject = new BehaviorSubject<any[]>([]);
    this.rolePassList$ = this.rolePassListSubject.asObservable();
  }

  getContentTypes() {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.dashboardHTTPService.getContentNews(auth.authToken).pipe(
      map((data) => {
        this.contentTypesSubject.next(data.data);
        return data.data;
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getCategories() {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.dashboardHTTPService.getCategories(auth.authToken).pipe(
      map((data) => {
        this.categoriesSubject.next(data.data);
        return data.data;
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getNewsOrderCategories() {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.dashboardHTTPService
      .getNewsOrderCategories(auth.authToken)
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

  getNewsSubCategories(id: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.dashboardHTTPService
      .getNewsSubCategories(auth.authToken, id)
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

  getNewsOrderSubCategories(id: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.dashboardHTTPService
      .getNewsOrderSubCategories(auth.authToken, id)
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

  getContentTypeSetting() {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.dashboardHTTPService.getContentTypeSetting(auth.authToken).pipe(
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

  getGalleryTypes() {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.dashboardHTTPService.getGalleryTypes(auth.authToken).pipe(
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

  getRolesPassList() {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.dashboardHTTPService.getRolesPassList(auth.authToken).pipe(
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
