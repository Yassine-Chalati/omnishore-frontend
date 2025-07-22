import { Title } from './title.model';
import { Contact } from './contact.model';
import { BaseEntity } from './base-entity.model';

export interface CvStructured {
  id: number;
  name: string;
  profil: string;
  titleResume: string;

  title: Title;
  contact: Contact;

  skills: BaseEntity[];
  experiences: BaseEntity[];
  educations: BaseEntity[];
  certifications: BaseEntity[];
  interests: BaseEntity[];
  languages: BaseEntity[];
  projects: BaseEntity[];
}
