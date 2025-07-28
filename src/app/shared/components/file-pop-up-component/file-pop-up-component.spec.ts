import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePopUpComponent } from './file-pop-up-component';

describe('FilePopUpComponent', () => {
  let component: FilePopUpComponent;
  let fixture: ComponentFixture<FilePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilePopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
