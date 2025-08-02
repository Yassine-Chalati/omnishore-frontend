import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../configurations/environment';
import { CvFilePage } from '../models/cv-file-page.model';
import { CvStructured } from '../models/cv-structured.model';

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private apiUrl = environment.backendUrl + '/api/cv/all';
  private uploadUrl = environment.backendUrl + '/api/cv/upload';
  private downloadBaseUrl = environment.backendUrl + '/api/cv/download';

  constructor(private http: HttpClient) {}

  /**
   * Fetches the structured CV format for a given CvFile id.
   * @param id CvFile id
   */
  getStructuredCv(id: number): Observable<CvStructured> {
    const url = `${environment.backendUrl}/api/cv/${id}`;
    return this.http.get<CvStructured>(url);
  }
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

  /**
   * Returns the direct download URL for a file by id.
   */
  getDownloadUrl(fileId: string | number): string {
    return `${this.downloadBaseUrl}/${fileId}`;
  }

  /**
   * Optionally: Download the file as a Blob (not required for direct iframe/img usage)
   */
  downloadFileAsBlob(fileId: string | number): Observable<Blob> {
    return this.http.get(this.getDownloadUrl(fileId), { responseType: 'blob' });
  }
}
