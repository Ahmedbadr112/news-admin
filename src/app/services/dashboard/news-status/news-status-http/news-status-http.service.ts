import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class NewsStatusHTTPService {
  constructor(private http: HttpClient) {}

  getNews(
    token: string,
    pageNumber: number,
    searchQuery?: string,
    statusId?: string,
    categoryId?: string,
    subCategoryId?: string
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
      `${API_URL}/News/GetNews?pageNumber=${pageNumber ?? 1}${
        searchQuery ? '&Search=' + searchQuery : ''
      }${statusId ? '&Status=' + statusId : ''}${
        categoryId ? '&MainType=' + categoryId : ''
      }${subCategoryId ? '&subType=' + subCategoryId : ''}`,
      {
        headers: httpHeaders,
      }
    );
  }
}
