import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAfterAuthComponent } from './header-after-auth.component';

describe('HeaderAfterAuthComponent', () => {
  let component: HeaderAfterAuthComponent;
  let fixture: ComponentFixture<HeaderAfterAuthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderAfterAuthComponent]
    });
    fixture = TestBed.createComponent(HeaderAfterAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
