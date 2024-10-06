import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class OrderEditorsHTTPService {
  constructor(private http: HttpClient) {}

  getOrderEditors(token: string, categoryId?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(
      `${API_URL}/OrderNews/GetNewsOrder${
        categoryId && `?categoryId=${categoryId}`
      }`,
      {
        headers: httpHeaders,
      }
    );
  }

  saveOrder(
    token: string,
    newsOrder: string[],
    categoryId?: string,
    subCategoryId?: string
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    newsOrder.forEach((id) => {
      formData.append('Ids', id);
    });

    if (categoryId) {
      formData.append('categoryId', categoryId);
    }

    if (subCategoryId) {
      formData.append('sectionId', subCategoryId);
    }

    return this.http.put<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/OrderNews/SaveOrder`, formData, {
      headers: httpHeaders,
    });
  }
}
