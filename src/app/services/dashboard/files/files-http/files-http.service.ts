import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}/Files/`;

@Injectable({
  providedIn: 'root',
})
export class FilesHTTPService {
  constructor(private http: HttpClient) {}

  getFiles(
    token: string,
    pageNumber: number,
    search?: string
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
      `${API_URL}GetFiles?pageNumber=${pageNumber ?? 1}${
        search ? '&search=' + search : ''
      }`,
      {
        headers: httpHeaders,
      }
    );
  }

  getFilesEvents(token: string, pageNumber: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}GetFiles?pageNumber=${pageNumber ?? 1}`, {
      headers: httpHeaders,
    });
  }

  deleteFilesEvents(token: string, ids: string[]): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    ids.forEach((id) => formData.append('DeleteFilesEvent', id));

    return this.http.delete<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}DeleteFilesEvents`, {
      body: formData,
      headers: httpHeaders,
    });
  }

  addEvent(token: string, event: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(
      `${API_URL}AddEvent`,
      { event },
      {
        headers: httpHeaders,
      }
    );
  }

  editEvent(token: string, event: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(
      `${API_URL}EditEvent`,
      { event },
      {
        headers: httpHeaders,
      }
    );
  }
}
