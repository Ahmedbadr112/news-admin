import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/pages/auth';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}/Editor/`;

@Injectable({
  providedIn: 'root',
})
export class EditorsHTTPService {
  private readonly _HttpClient = inject(HttpClient);
  constructor(private http: HttpClient) {}

  getAllEditors(
    token: string,
    pageNumber?: number,
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
      `${API_URL}GetAllEditors?pageNumber=${pageNumber ?? 1}${
        search ? '&Search=' + search : ''
      }`,
      {
        headers: httpHeaders,
      }
    );
  }
  getEditorById(token: string, id: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log(id);
    return this._HttpClient.get(`${API_URL}GetEditorById?EditorId=${id}`, {
      headers: httpHeaders,
    });
  }
  editEditor(
    token: string,
    EditorName: string,
    EditorId?: string,
    Picture?: File,
    Description?: string,
    EditorEmail?: string
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    // Append required and optional fields
    formData.append('EditorName', EditorName);
    formData.append('EditorId', EditorId ?? '');
    if (Picture) {
      formData.append('Picture', Picture);
    }
    if (Description) {
      formData.append('Description', Description);
    }
    if (EditorEmail) {
      formData.append('EditorEmail', EditorEmail);
    }

    return this._HttpClient.put<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}EditEditor`, formData, {
      headers: httpHeaders,
    });
  }

  toggleEnableEditor(token: string, editorId: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();
    formData.append('EditorId', editorId);

    return this.http.put<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}DisbleOrEnableEditor`, formData, {
      headers: httpHeaders,
    });
  }

  addEditor(
    token: string,
    EditorName: string,
    Picture?: File,
    Description?: string,
    EditorEmail?: string
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();
    formData.append('EditorName', EditorName);
    formData.append('Picture', Picture ?? '');
    formData.append('Description', Description ?? '');
    formData.append('EditorEmail', EditorEmail ?? '');

    return this.http.post<{
      status: number;
      data: any[];
      message: string | null;
      errors: string[] | null;
    }>(`${API_URL}AddEditor`, formData, {
      headers: httpHeaders,
    });
  }
}
