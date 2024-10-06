import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}/News/`;

@Injectable({ providedIn: 'root' })
export class OperationsHTTPService {
  constructor(private http: HttpClient) {}

  getOperations(token: string): any {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${API_URL}/api/Operations/GetOperations`, {
      headers: httpHeaders,
    });
  }
}
