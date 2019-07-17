import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoutineSettingsPage } from './view-routine-settings.page';

describe('ViewRoutineSettingsPage', () => {
  let component: ViewRoutineSettingsPage;
  let fixture: ComponentFixture<ViewRoutineSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRoutineSettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRoutineSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
