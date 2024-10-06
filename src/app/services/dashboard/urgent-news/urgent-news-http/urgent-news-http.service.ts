import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}/UrgentNews/`;

@Injectable({
  providedIn: 'root',
})
export class UrgentNewsHTTPService {
  constructor(private http: HttpClient) {}

  getUrgentNews(token: string, pageNumber?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(
      `${API_URL}GetUrgentNews?pageNumber=${pageNumber ?? '1'}`,
      {
        headers: httpHeaders,
      }
    );
  }

  addUrgentContent(token: string, ids: string[]): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(
      `${API_URL}AddUrgentContent`,
      { dailyNewsIds: ids },
      {
        headers: httpHeaders,
      }
    );
  }

  addUrgentContentWithTitle(
    token: string,
    title: string,
    isUrgentNew: boolean
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    formData.append('Tital', title);
    formData.append('IsUrgentNew', String(isUrgentNew));

    return this.http.post<any>(
      `${API_URL}AddUrgentContentWithTitle`,
      formData,
      {
        headers: httpHeaders,
      }
    );
  }

  toggleEnableUrgentNew(token: string, urgentNewId: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(
      `${API_URL}EnableOrDisableNew?Id=${urgentNewId}`,
      {},
      {
        headers: httpHeaders,
      }
    );
  }

  deleteUrgentContent(token: string, urgentNewId: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}DeleteUrgentContent?Id=${urgentNewId}`, {
      headers: httpHeaders,
    });
  }

  updateUrgentContent(
    token: string,
    urgentNewId: string,
    title: string,
    isUrgentNew: boolean
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    formData.append('NewsId', urgentNewId);
    formData.append('Title', title);
    formData.append('IsUrgentNew', String(isUrgentNew));

    return this.http.put<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}UpdateUrgentContent`, formData, {
      headers: httpHeaders,
    });
  }

  getDailyNewsContent(
    token: string,
    pageNumber?: number,
    search?: string,
    categoryId?: string,
    subCategoryId?: string
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(
      `${API_URL}GetDailyNewsContent?PageNumber=${pageNumber ?? 1}${
        search ? '&Search' + search : ''
      }${categoryId ? '&CategoryId' + categoryId : ''}${
        subCategoryId ? '&SectionId' + subCategoryId : ''
      }`,
      {
        headers: httpHeaders,
      }
    );
  }
}
