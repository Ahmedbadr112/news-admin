import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../../models/user.model';
import { environment } from '../../../../environments/environment';

const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  // public methods
  login(userName: string, password: string): Observable<any> {
    return this.http.post<{
      status: number;
      data: {
        token: string;
        userId: string;
        email: string;
        userName: string;
        phoneNumber: string;
        expireOn: string;
      };
      message: string | null;
      errors: string[] | null;
    }>(`${API_USERS_URL}/Auth/Login`, {
      userName,
      password,
    });
  }

  getUserByToken(token: string): Observable<UserModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserModel>(`${API_USERS_URL}/User/GetUser`, {
      headers: httpHeaders,
    });
  }
}
