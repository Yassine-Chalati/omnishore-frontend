export interface CvFile {
  id: number;
  fileName: string;
  addedDate: string; // or `Date` if you convert it
  imageUrl: string;
  fileType: string;
}