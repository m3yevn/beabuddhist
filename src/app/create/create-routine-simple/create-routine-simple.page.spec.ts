import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoutineSimplePage } from './create-routine-simple.page';

describe('CreateRoutineSimplePage', () => {
  let component: CreateRoutineSimplePage;
  let fixture: ComponentFixture<CreateRoutineSimplePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRoutineSimplePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoutineSimplePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
