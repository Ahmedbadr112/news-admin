import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}/Image/`;

@Injectable({
  providedIn: 'root',
})
export class GalleryHTTPService {
  constructor(private http: HttpClient) {}

  addGallery(token: string, gallery: { [key: string]: any }): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    for (const key in gallery) {
      if (gallery.hasOwnProperty(key)) {
        formData.append(key, gallery[key].toString());
      }
    }

    return this.http.post<any>(`${API_URL}AddGallery`, formData, {
      headers: httpHeaders,
    });
  }

  getGalleryById(token: string, galleryId: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(
      `${API_URL}GetGalleryById?GalleryId=${galleryId}`,
      {
        headers: httpHeaders,
      }
    );
  }

  editGallery(token: string, gallery: { [key: string]: any }): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    for (const key in gallery) {
      if (gallery.hasOwnProperty(key)) {
        formData.append(key, gallery[key].toString());
      }
    }

    return this.http.put<any>(`${API_URL}EditGallery`, formData, {
      headers: httpHeaders,
    });
  }

  updateGalleryToMain(token: string, galleryId: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();

    formData.append('GalleryId', galleryId);

    return this.http.put<any>(`${API_URL}UpdateGalleryToMain`, formData, {
      headers: httpHeaders,
    });
  }

  deleteGallery(token: string, galleryId: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<any>(
      `${API_URL}DeleteGallery?GalleryId=${galleryId}`,
      {
        headers: httpHeaders,
      }
    );
  }
}
