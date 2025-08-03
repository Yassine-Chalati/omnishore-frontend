import { JobDescriptionFileType } from "../enums/job-description-file-type.enum";


export interface JobDescriptionFile {
  id: number;
  fileName: string;
  addedDate: string; // or `Date` if you convert it
  content: string;
  type: JobDescriptionFileType; // Updated fileType to type
}