import { CvFile } from "./cv-file.model";

export interface CvFilePage {
  content: CvFile[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}