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
import { SectionsHTTPService } from './sections-http/sections-http.service';

@Injectable({
  providedIn: 'root',
})
export class SectionsService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private authService: AuthService,
    private sectionsHTTPService: SectionsHTTPService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  addMainSection(data: { [key: string]: any }) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.sectionsHTTPService.addMainSection(auth.authToken, data).pipe(
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

  editSection(data: { [key: string]: any }) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    return this.sectionsHTTPService.editSection(auth.authToken, data).pipe(
      map((data) => {
        return data;
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      })
    );
  }

  getAllSections(
    pageNumber: number,
    categoryId?: string,
    searchQuery?: string
  ) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.sectionsHTTPService
      .getAllSections(auth.authToken, pageNumber, categoryId)
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

  deleteSections(sectionsIds: string[]) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.sectionsHTTPService
      .deleteSections(auth.authToken, sectionsIds)
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

  getOrderedSections(categoryId: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.sectionsHTTPService
      .getOrderedSections(auth.authToken, categoryId)
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

  orderSections(categoryId: string, ids: string[]) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.sectionsHTTPService
      .orderedSections(auth.authToken, categoryId, ids)
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

  getSectionById(sectionId: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    return this.sectionsHTTPService
      .getSectionById(auth.authToken, sectionId)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((err) => {
          console.error('err', err);
          throw err;
        })
      );
  }
}
