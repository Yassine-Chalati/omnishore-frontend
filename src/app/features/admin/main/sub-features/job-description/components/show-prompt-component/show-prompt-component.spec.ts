import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPromptComponent } from './show-prompt-component';

describe('ShowPromptComponent', () => {
  let component: ShowPromptComponent;
  let fixture: ComponentFixture<ShowPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowPromptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
