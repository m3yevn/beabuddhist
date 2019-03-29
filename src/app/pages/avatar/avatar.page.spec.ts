import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarPage } from './avatar.page';

describe('AvatarPage', () => {
  let component: AvatarPage;
  let fixture: ComponentFixture<AvatarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AvatarPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
