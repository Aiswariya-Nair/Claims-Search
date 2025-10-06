import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeaheadInput } from './typeahead-input';

describe('TypeaheadInput', () => {
  let component: TypeaheadInput;
  let fixture: ComponentFixture<TypeaheadInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeaheadInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeaheadInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
