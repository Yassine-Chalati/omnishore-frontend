import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDescriptionTableComponent } from './job-description-table-component';

describe('JobDescriptionTableComponent', () => {
  let component: JobDescriptionTableComponent;
  let fixture: ComponentFixture<JobDescriptionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDescriptionTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobDescriptionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
