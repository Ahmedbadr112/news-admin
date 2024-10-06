import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class EditorNewsStatusHTTPService {
  constructor(private http: HttpClient) {}

  getMyNews(
    token: string,
    pageNumber: number,
    statusId?: string
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
      `${API_URL}/News/GetMyNews?pageNumber=${pageNumber ?? 1}${
        statusId ? '&newsStatus=' + statusId : ''
      }`,
      {
        headers: httpHeaders,
      }
    );
  }
}
