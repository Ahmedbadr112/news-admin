import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}/Section/`;

@Injectable({
  providedIn: 'root',
})
export class SectionsHTTPService {
  constructor(private http: HttpClient) {}

  addMainSection(token: string, data: { [key: string]: any }): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key].toString());
      }
    }

    return this.http.post<any>(`${API_URL}AddMainSection`, formData, {
      headers: httpHeaders,
    });
  }

  editSection(token: string, data: { [key: string]: any }): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    console.log(data);

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key].toString());
      }
    }

    return this.http.put<any>(`${API_URL}UpdateSection`, formData, {
      headers: httpHeaders,
    });
  }

  getAllSections(
    token: string,
    pageNumber: number,
    categoryId?: string,
    searchQuery?: string
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(
      `${API_URL}GetAllSection?PageNumber=${pageNumber}&CatId=${categoryId}${
        searchQuery ? '&Search=' + searchQuery : ''
      }`,
      {
        headers: httpHeaders,
      }
    );
  }

  deleteSections(token: string, sectionsIds: string[]): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    sectionsIds.forEach((id) => formData.append('sectionIds', id));

    return this.http.delete<any>(`${API_URL}DeleteSection`, {
      headers: httpHeaders,
      body: formData,
    });
  }

  getOrderedSections(token: string, categoryId: string) {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(
      `${API_URL}GetOrderSectionList?CategoryId=${categoryId}`,
      {
        headers: httpHeaders,
      }
    );
  }

  orderedSections(token: string, categoryId: string, ids: string[]) {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    ids.forEach((id) => formData.append('SectionIds', id));
    formData.append('CategoryId', categoryId);

    return this.http.put<any>(`${API_URL}OrderSectionList`, formData, {
      headers: httpHeaders,
    });
  }

  getSectionById(token: string, sectionId: string) {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${API_URL}GetSectionById?Id=${sectionId}`, {
      headers: httpHeaders,
    });
  }
}
