import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvTableComponent } from './cv-table-component';

describe('CvTableComponent', () => {
  let component: CvTableComponent;
  let fixture: ComponentFixture<CvTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
