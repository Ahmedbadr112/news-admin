import { Editor } from './../../../models/data.model';
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
import { EditorsHTTPService } from './editors-http/editors-http.service';

@Injectable({
  providedIn: 'root',
})
export class EditorsService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  Editor: Editor[];

  constructor(
    private authService: AuthService,
    private editorsHTTPService: EditorsHTTPService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  getAllEditors(pageNumber?: number, search?: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.editorsHTTPService
      .getAllEditors(auth.authToken, pageNumber, search)
      .pipe(
        map((data) => {
          console.log(data);
          return data.data;
        }),
        catchError((err) => {
          console.error('err', err);
          return of(undefined);
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  addEditor(
    EditorName: string,
    Picture?: File,
    Description?: string,
    EditorEmail?: string
  ) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.editorsHTTPService
      .addEditor(auth.authToken, EditorName, Picture, Description, EditorEmail)
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
 
  editEditor(
    EditorName: string,
    editorId?: string,
    Picture?: File,
    Description?: string,
    EditorEmail?: string
  ) {
    const auth = this.authService.getAuthFromLocalStorage();

    // Check if authToken is available, return undefined observable if not
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);

    // Call the HTTP service to send the PUT request
    return this.editorsHTTPService
      .editEditor(
        auth.authToken,
        EditorName,
        editorId,
        Picture,
        Description,
        EditorEmail
      )
      .pipe(
        map((data) => {
          // Successful response, returning data
          return data;
        }),
        catchError((err) => {
          // Error handling, logging the error
          console.error('Error in editEditor:', err);
          return of(undefined); // Return undefined on error
        }),
        finalize(() => this.isLoadingSubject.next(false)) // Reset loading state
      );
  }

  toggleEnableEditor(editorId: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.editorsHTTPService
      .toggleEnableEditor(auth.authToken, editorId)
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
