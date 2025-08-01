import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingPage } from './matching-page';

describe('MatchingPage', () => {
  let component: MatchingPage;
  let fixture: ComponentFixture<MatchingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchingPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
