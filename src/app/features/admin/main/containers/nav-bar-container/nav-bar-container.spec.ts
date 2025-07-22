import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarContainer } from './nav-bar-container';

describe('NavBarContainer', () => {
  let component: NavBarContainer;
  let fixture: ComponentFixture<NavBarContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
