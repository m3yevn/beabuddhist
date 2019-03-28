import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoutinePage } from './edit-routine.page';

describe('EditRoutinePage', () => {
  let component: EditRoutinePage;
  let fixture: ComponentFixture<EditRoutinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRoutinePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRoutinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
