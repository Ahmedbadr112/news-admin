import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class DashboardHTTPService {
  constructor(private http: HttpClient) {}

  getGalleryTypes(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/Image/GetGalleryTypes`, {
      headers: httpHeaders,
    });
  }

  getContentNews(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/ContentTypes/GetContentTypes`, {
      headers: httpHeaders,
    });
  }

  getCategories(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: { categoryID: string; name: string }[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/NewsCategory/GetNewsCategories`, {
      headers: httpHeaders,
    });
  }

  getNewsOrderCategories(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: { id: string; name: string }[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/OrderNews/GetNewsOrderSections`, {
      headers: httpHeaders,
    });
  }

  getNewsSubCategories(token: string, id?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: { sectionID: string; secTitle: string }[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/NewsCategory/GetNewsSubCategories?categoryId=${id}`, {
      headers: httpHeaders,
    });
  }

  getNewsOrderSubCategories(token: string, id: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: { sectionID: string; secTitle: string }[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/NewsCategory/GetNewsSubCategories?categoryId=${id}`, {
      headers: httpHeaders,
    });
  }

  getContentTypeSetting(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/News/ContentTypeSetting`, {
      headers: httpHeaders,
    });
  }

  getRolesPassList(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: { id: string; name: string }[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/News/GetRolesPassList`, {
      headers: httpHeaders,
    });
  }
}
