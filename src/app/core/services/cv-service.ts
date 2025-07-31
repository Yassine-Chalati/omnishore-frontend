import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../configurations/environment';
import { CvFilePage } from '../models/cv-file-page.model';

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private apiUrl = environment.backendUrl + '/api/cv/all';
  private uploadUrl = environment.backendUrl + '/api/cv/upload';

  constructor(private http: HttpClient) {}

  getCvFiles(page = 0, size = 5, sort = 'addedDate,desc'): Observable<CvFilePage> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);
    return this.http.get<CvFilePage>(this.apiUrl, { params });
  }

  uploadCvFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.uploadUrl, formData, { reportProgress: true, observe: 'events' });
  }
}
