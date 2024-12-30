import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcripCheckoutComponent } from './subcrip-checkout.component';

describe('SubcripCheckoutComponent', () => {
  let component: SubcripCheckoutComponent;
  let fixture: ComponentFixture<SubcripCheckoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubcripCheckoutComponent]
    });
    fixture = TestBed.createComponent(SubcripCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
