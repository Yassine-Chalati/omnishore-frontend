import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFilesComponent } from './upload-files-component';

describe('UploadFilesComponent', () => {
  let component: UploadFilesComponent;
  let fixture: ComponentFixture<UploadFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
