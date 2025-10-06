import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsGrid } from './claims-grid';

describe('ClaimsGrid', () => {
  let component: ClaimsGrid;
  let fixture: ComponentFixture<ClaimsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimsGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimsGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
