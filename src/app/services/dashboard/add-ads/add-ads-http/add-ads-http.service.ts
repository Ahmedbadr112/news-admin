import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}/ADS`;

@Injectable({
  providedIn: 'root',
})
export class AddADSHTTPService {
  constructor(private http: HttpClient) {}

  addGeneralHeaders(token: string, generalHeaders: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(
      `${API_URL}AddGeneralHeaders`,
      { generalHeaders },
      {
        headers: httpHeaders,
      }
    );
  }
  addHomePageHeaders(token: string, homePageHeaders: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(
      `${API_URL}AddGeneralHeaders`,
      { homePageHeaders },
      {
        headers: httpHeaders,
      }
    );
  }

  addInnerPageHeaders(
    token: string,
    innnerPageHeaders: string
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(
      `${API_URL}AddGeneralHeaders`,
      { innnerPageHeaders },
      {
        headers: httpHeaders,
      }
    );
  }

  addAdsTextFileCode(
    token: string,
    innnerPageHeaders: string
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(
      `${API_URL}AddAdsTextFileCode`,
      { innnerPageHeaders },
      {
        headers: httpHeaders,
      }
    );
  }
}
