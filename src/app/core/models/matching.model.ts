import { CvFile } from './cv-file.model';

export interface Matching {
  id: number;
  score: number;
  cvFile: CvFile;
}
