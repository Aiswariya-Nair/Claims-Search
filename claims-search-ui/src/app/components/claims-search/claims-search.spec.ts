import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsSearch } from './claims-search';

describe('ClaimsSearch', () => {
  let component: ClaimsSearch;
  let fixture: ComponentFixture<ClaimsSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimsSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimsSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
