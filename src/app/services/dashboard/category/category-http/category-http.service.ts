import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}/NewsCategory/`;

@Injectable({
  providedIn: 'root',
})
export class CategoryHTTPService {
  constructor(private http: HttpClient) {}

  addCategory(token: string, data: { [key: string]: any }): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key].toString());
      }
    }

    return this.http.post<any>(`${API_URL}AddNewsCategory`, formData, {
      headers: httpHeaders,
    });
  }

  getAllCategories(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${API_URL}GetNewsCategories`, {
      headers: httpHeaders,
    });
  }

  deleteCategories(token: string, categoriesIds: string[]): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    categoriesIds.forEach((id) => formData.append('CatId', id));

    return this.http.delete<any>(`${API_URL}DeleteNewsCategory`, {
      headers: httpHeaders,
      body: formData,
    });
  }

  getOrderedCategories(token: string) {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${API_URL}GetOrderNewsCategoryList`, {
      headers: httpHeaders,
    });
  }

  orderedCategories(token: string, ids: string[]) {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    ids.forEach((id) => formData.append('NewsCategoryIds', id));

    return this.http.put<any>(`${API_URL}SortingNewscategoryList`, formData, {
      headers: httpHeaders,
    });
  }
}
