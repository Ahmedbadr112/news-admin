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
import { OrderEditorsHTTPService } from './order-editors-http/order-editors-http.service';

@Injectable({
  providedIn: 'root',
})
export class OrderEditorsService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private authService: AuthService,
    private OrderEditorsHTTPService: OrderEditorsHTTPService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  getOrderEditors(categoryId?: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.OrderEditorsHTTPService.getOrderEditors(
      auth.authToken,
      categoryId
    ).pipe(
      map((data: any) => {
        return data.data;
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  saveOrder(newsOrder: string[], categoryId?: string, subCategoryId?: string) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.OrderEditorsHTTPService.saveOrder(
      auth.authToken,
      newsOrder,
      categoryId,
      subCategoryId
    ).pipe(
      map((data: any) => {
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
