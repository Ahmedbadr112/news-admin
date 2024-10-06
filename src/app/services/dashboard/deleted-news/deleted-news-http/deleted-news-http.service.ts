import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class DeletedNewsHTTPService {
  constructor(private http: HttpClient) {}

  getDeletedNews(
    token: string,
    pageNumber?: number,
    search?: string,
    MainCategoryId?: string,
    SecCategoryId?: string
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(
      `${API_URL}/News/GetDeletedNews?pageNumber=${pageNumber ?? 1}${
        search ? '&Search=' + search : ''
      }${MainCategoryId ? '&MainCategoryId=' + MainCategoryId : ''}${
        SecCategoryId ? '&SecCategoryId=' + SecCategoryId : ''
      }`,
      {
        headers: httpHeaders,
      }
    );
  }

  deleteDeletedNew(token: string, ids: string[]): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    ids.forEach((id) => formData.append('DeleteDeletedNews', id));

    return this.http.delete<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/News/DeleteDeletedNews`, {
      body: formData,
      headers: httpHeaders,
    });
  }
}
