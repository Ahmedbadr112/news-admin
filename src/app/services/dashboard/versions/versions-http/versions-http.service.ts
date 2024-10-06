import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}/NewsVersions/`;

@Injectable({
  providedIn: 'root',
})
export class VersionsHTTPService {
  constructor(private http: HttpClient) {}

  getNewsVersions(token: string, newsId: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${API_URL}GetNewsVersions?newsId=${newsId}`, {
      headers: httpHeaders,
    });
  }

  compareNews(token: string, newsIds: string[]): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(
      `${API_URL}CompareNews?oldVersion=${newsIds[0]}&newVersion=${newsIds[1]}`,
      {
        headers: httpHeaders,
      }
    );
  }
}
