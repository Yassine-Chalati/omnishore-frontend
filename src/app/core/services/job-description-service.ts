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
  
  constructor(private http: HttpClient) {}

  getJobDescriptionFiles(page = 0, size = 5, sort = 'id,desc'): Observable<JobDescriptionFilePage> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);
    return this.http.get<JobDescriptionFilePage>(this.jobDescriptionUrl, { params });
  }
}
