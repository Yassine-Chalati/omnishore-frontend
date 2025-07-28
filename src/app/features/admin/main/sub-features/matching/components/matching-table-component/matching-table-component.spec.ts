import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingTableComponent } from './matching-table-component';

describe('MatchingTableComponent', () => {
  let component: MatchingTableComponent;
  let fixture: ComponentFixture<MatchingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
