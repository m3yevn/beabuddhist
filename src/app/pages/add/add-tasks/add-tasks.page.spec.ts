import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTasksPage } from './add-tasks.page';

describe('AddTasksPage', () => {
  let component: AddTasksPage;
  let fixture: ComponentFixture<AddTasksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTasksPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
