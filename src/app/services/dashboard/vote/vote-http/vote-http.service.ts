import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}/Votes/`;

@Injectable({
  providedIn: 'root',
})
export class VoteHTTPService {
  constructor(private http: HttpClient) {}

  addVote(
    token: string,
    vote: {
      sectionId: string;
      pollBody: string;
      startDate: string;
      endDate: string;
      voteOptions: string[];
    }
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(`${API_URL}AddVote`, vote, {
      headers: httpHeaders,
    });
  }

  getAllVotes(
    token: string,
    search?: string,
    categoryId?: string
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(
      `${API_URL}GetAllVotes${search ? `?search=${search}` : ''}${
        categoryId ? (search ? '&' : '?') + 'SectionId=' + categoryId : ''
      }`,
      {
        headers: httpHeaders,
      }
    );
  }

  deleteVotes(token: string, ids: string[]): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    ids.forEach((id) => formData.append('pollIds', id));

    return this.http.delete<any>(`${API_URL}DeleteVote`, {
      headers: httpHeaders,
      body: formData,
    });
  }

  activeVote(token: string, id: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(
      `${API_URL}ActiveVote?Id=${id}`,
      {},
      {
        headers: httpHeaders,
      }
    );
  }
}
