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
import { GalleryHTTPService } from './gallery-http/gallery-http.service';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private authService: AuthService,
    private galleryHTTPService: GalleryHTTPService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  addGallery(gallery: { [key: string]: any }) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.galleryHTTPService.addGallery(auth.authToken, gallery).pipe(
      map((data) => {
        return data;
      }),
      catchError((err) => {
        console.error('err', err);
        throw err;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getGalleryById(galleryId: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    return this.galleryHTTPService
      .getGalleryById(auth.authToken, galleryId)
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

  editGallery(gallery: { [key: string]: any }) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    return this.galleryHTTPService.editGallery(auth.authToken, gallery).pipe(
      map((data) => {
        return data;
      }),
      catchError((err) => {
        console.error('err', err);
        throw err;
      })
    );
  }

  updateGalleryToMain(galleryId: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.galleryHTTPService
      .updateGalleryToMain(auth.authToken, galleryId)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((err) => {
          console.error('err', err);
          throw err;
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  deleteGallery(galleryId: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.galleryHTTPService
      .deleteGallery(auth.authToken, galleryId)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((err) => {
          console.error('err', err);
          throw err;
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }
}
