import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUserPage } from './search-user.page';

describe('SearchUserPage', () => {
  let component: SearchUserPage;
  let fixture: ComponentFixture<SearchUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchUserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
