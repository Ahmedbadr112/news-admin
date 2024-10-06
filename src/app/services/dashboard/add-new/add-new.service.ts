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
import { AddNewHTTPService } from './add-new-http/add-new-http.service';

@Injectable({
  providedIn: 'root',
})
export class AddNewService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private authService: AuthService,
    private AddNewHTTPService: AddNewHTTPService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  getGalleries() {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.AddNewHTTPService.getGalleries(auth.authToken).pipe(
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

  getGalleryByType(galleryId?: string, search?: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    return this.AddNewHTTPService.getGalleryByType(
      auth.authToken,
      galleryId,
      search
    ).pipe(
      map((data) => {
        return data.data;
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      })
    );
  }

  getGalleryImages(
    pageNumber?: number,
    galleryTypeId?: string,
    galleryId?: string,
    searchText?: string
  ) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.AddNewHTTPService.getGalleryImages(
      auth.authToken,
      pageNumber,
      galleryTypeId,
      galleryId,
      searchText
    ).pipe(
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

  addImage(
    subCategoryId?: string,
    Caption?: string,
    CHKWaterMark?: boolean,
    ImageUrl?: string,
    Width?: number,
    Hieght?: number,
    XAccess?: number,
    YAccess?: number,
    Image?: File
  ) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    return this.AddNewHTTPService.addImage(
      auth.authToken,
      subCategoryId,
      Caption,
      CHKWaterMark,
      ImageUrl,
      Width,
      Hieght,
      XAccess,
      YAccess,
      Image
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((err) => {
        console.error('err', err);
        throw err;
      })
    );
  }

  updateImage(
    ImageId?: string,
    Caption?: string,
    CHKWaterMark?: boolean,
    ImageUrl?: string,
    Width?: number,
    Hieght?: number,
    XAccess?: number,
    YAccess?: number,
    Image?: File
  ) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    return this.AddNewHTTPService.updateImage(
      auth.authToken,
      ImageId,
      Caption,
      CHKWaterMark,
      ImageUrl,
      Width,
      Hieght,
      XAccess,
      YAccess,
      Image
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((err) => {
        console.error('err', err);
        throw err;
      })
    );
  }

  deleteImage(id?: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    return this.AddNewHTTPService.deleteImage(auth.authToken, id).pipe(
      map((data) => {
        return data;
      }),
      catchError((err) => {
        console.error('err', err);
        throw err;
      })
    );
  }

  setMainImage(id?: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    return this.AddNewHTTPService.setMainImage(auth.authToken, id).pipe(
      map((data) => {
        return data;
      }),
      catchError((err) => {
        console.error('err', err);
        throw err;
      })
    );
  }

  addNew(
    newsAction?: number,
    sectionId?: number,
    catId?: number,
    NewsType?: number,
    Title?: string,
    SubTitle?: string,
    Story?: string,
    Brief?: string,
    Tags?: string[],
    image1Id?: number,
    image2Id?: number,
    PictureCaption1?: string,
    PicCaption2?: string,
    ByLine?: string,
    Notes?: string,
    ContentAlbumIds?: string[],
    ChkNewsTicker?: boolean,
    ChkTopNews?: boolean,
    ChkTopNewCategory?: boolean,
    ChkReadNow?: boolean,
    ChkImportantNews?: boolean,
    ChkFilesNews?: boolean,
    ChkTopNewSection?: boolean,
    ChkIsVideo?: boolean,
    ChkIsInstall?: boolean,
    ChkIsAkbhbarKhassa?: boolean,
    ChkIsImage?: boolean,
    PublishDate?: string
  ) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.AddNewHTTPService.addNew(
      auth.authToken,
      newsAction,
      sectionId,
      catId,
      NewsType,
      Title,
      SubTitle,
      Story,
      Brief,
      Tags,
      image1Id,
      image2Id,
      PictureCaption1,
      PicCaption2,
      ByLine,
      Notes,
      ContentAlbumIds,
      ChkNewsTicker,
      ChkTopNews,
      ChkTopNewCategory,
      ChkReadNow,
      ChkImportantNews,
      ChkFilesNews,
      ChkTopNewSection,
      ChkIsVideo,
      ChkIsInstall,
      ChkIsAkbhbarKhassa,
      ChkIsImage,
      PublishDate
    ).pipe(
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

  addDraft(form: any, tags: string[], selectedImage: any, date: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.AddNewHTTPService.addDraft(
      auth.authToken,
      form,
      tags,
      selectedImage,
      date
    ).pipe(
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

  getDrafts() {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.AddNewHTTPService.getDrafts(auth.authToken).pipe(
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

  restoreDraft(id: number) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.AddNewHTTPService.restoreDraft(auth.authToken, id).pipe(
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

  deleteAllDrafts() {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.AddNewHTTPService.deleteAllDrafts(auth.authToken).pipe(
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

  getDraftById(id: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.AddNewHTTPService.getDraftById(auth.authToken, id).pipe(
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
