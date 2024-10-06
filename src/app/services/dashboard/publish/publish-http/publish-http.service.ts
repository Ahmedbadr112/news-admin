import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class PublishHTTPService {
  constructor(private http: HttpClient) {}

  getNewsToPublish(
    token: string,
    search?: string,
    categoryId?: string,
    subCategoryId?: string
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
      `${API_URL}/PublishNews/GetNewsToPublish?Search=${search ?? ''}${
        categoryId ? '&CategoryId=' + categoryId : ''
      }${subCategoryId ? '&SectionId=' + subCategoryId : ''}`,
      {
        headers: httpHeaders,
      }
    );
  }

  deleteNew(token: string, ids: string[]): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    ids.forEach((id) => {
      formData.append(`NewsIDs`, String(id));
    });

    return this.http.delete<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/PublishNews/DeleteNews`, {
      headers: httpHeaders,
      body: formData,
    });
  }

  publishNews(token: string, ids: string[]): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    ids.forEach((id) => {
      formData.append(`NewsIDs`, id);
    });

    return this.http.post<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/PublishNews/PublishNews`, formData, {
      headers: httpHeaders,
    });
  }

  returnNews(
    token: string,
    newsStatus: number,
    newsIds: string[]
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();
    formData.append('NewStatus', String(newsStatus));
    newsIds.forEach((id) => {
      formData.append(`NewsIDs`, id);
    });

    return this.http.put<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/PublishNews/ReturnNews`, formData, {
      headers: httpHeaders,
    });
  }
}
