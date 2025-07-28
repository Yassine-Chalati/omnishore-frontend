import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructuredCvFormComponent } from './structured-cv-form-component';

describe('StructuredCvFormComponent', () => {
  let component: StructuredCvFormComponent;
  let fixture: ComponentFixture<StructuredCvFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructuredCvFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructuredCvFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
