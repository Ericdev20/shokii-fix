import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConditionComponent } from './user-condition.component';

describe('UserConditionComponent', () => {
  let component: UserConditionComponent;
  let fixture: ComponentFixture<UserConditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserConditionComponent]
    });
    fixture = TestBed.createComponent(UserConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
