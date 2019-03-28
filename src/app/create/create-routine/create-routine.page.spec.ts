import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoutinePage } from './create-routine.page';

describe('CreateRoutinesPage', () => {
  let component: CreateRoutinePage;
  let fixture: ComponentFixture<CreateRoutinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRoutinePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoutinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
