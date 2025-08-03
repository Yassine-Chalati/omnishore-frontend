import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../configurations/environment';
import { JobDescriptionFile } from '../models/job-description-file.model';
import { JobDescriptionFilePage } from '../models/job-description-file-page.model';

@Injectable({
  providedIn: 'root'
})
export class JobDescriptionService {
  private jobDescriptionUrl = environment.backendUrl + '/api/job-description/all';
  private downloadBaseUrl = environment.backendUrl + '/api/job-description/download';
  
  constructor(private http: HttpClient) {}

  getJobDescriptionFiles(page = 0, size = 5, sort = 'id,desc'): Observable<JobDescriptionFilePage> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);
    return this.http.get<JobDescriptionFilePage>(this.jobDescriptionUrl, { params });
  }

  getDownloadUrl(fileName: string): string {
    return `${this.downloadBaseUrl}/${fileName}`;
  }

  downloadFileAsBlob(fileName: string): Observable<Blob> {
    return this.http.get(this.getDownloadUrl(fileName), { responseType: 'blob' });
  }
  
  uploadPrompt(prompt: string): Observable<any> {
    const url = environment.backendUrl + '/api/job-description/upload/prompt';
    return this.http.post(url, prompt, { responseType: 'json' });
  }
}
