import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkAndLghtModeButtonComponent } from './dark-and-lght-mode-button-component';

describe('DarkAndLghtModeButtonComponent', () => {
  let component: DarkAndLghtModeButtonComponent;
  let fixture: ComponentFixture<DarkAndLghtModeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarkAndLghtModeButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DarkAndLghtModeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
