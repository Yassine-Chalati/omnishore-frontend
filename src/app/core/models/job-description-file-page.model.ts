import { JobDescriptionFile } from './job-description-file.model';

export interface JobDescriptionFilePage {
  content: JobDescriptionFile[];
  pageable: any;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}