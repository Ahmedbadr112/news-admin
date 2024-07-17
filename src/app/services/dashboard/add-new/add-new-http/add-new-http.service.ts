import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterOption, NEW } from 'src/app/models/new.model';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class AddNewHTTPService {
  constructor(private http: HttpClient) {}

  getGalleries(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: NEW[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/Image/GetGalleries`, {
      headers: httpHeaders,
    });
  }

  getGalleryTypes(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: NEW[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/Image/GetGalleryTypes`, {
      headers: httpHeaders,
    });
  }

  getGalleryByType(token: string, galleryId: string = '0'): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: NEW[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/Image/GetGalleryByType?categoryId=${galleryId}`, {
      headers: httpHeaders,
    });
  }

  getGalleryImages(
    token: string,
    filterOptions: {
      pageNumber: string;
      GalleryTypeId?: string;
      GalleryId?: string;
      searchText?: string;
    } = { pageNumber: '1' }
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: NEW[];
      message: string | null;
      errors: string[] | null;
    }>(
      `${API_URL}/Image/GetGalleryImages?pageNumber=${
        filterOptions.pageNumber
      }${
        filterOptions.GalleryTypeId &&
        `&GalleryTypeId=${filterOptions.GalleryTypeId}`
      }${filterOptions.GalleryId && `&GalleryId=${filterOptions.GalleryId}`}${
        filterOptions.searchText && `&searchText=${filterOptions.searchText}`
      }`,
      {
        headers: httpHeaders,
      }
    );
  }

  getDrafts(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: NEW[] | null;
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/Draft/GetDrafts`, {
      headers: httpHeaders,
    });
  }

  deleteAllDrafts(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<{
      status: number;
      data: NEW[] | null;
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/Draft/DeleteAllDrafts`, {
      headers: httpHeaders,
    });
  }

  getDraftById(token: string, id: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: NEW[] | null;
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}/Draft/GetDrafts?draftId=${id}`, {
      headers: httpHeaders,
    });
  }
}
