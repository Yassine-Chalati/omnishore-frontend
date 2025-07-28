import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCertificationComponent } from './form-certification.component';

describe('FormCertificationComponent', () => {
  let component: FormCertificationComponent;
  let fixture: ComponentFixture<FormCertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCertificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
