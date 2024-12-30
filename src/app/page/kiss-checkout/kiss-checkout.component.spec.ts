import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KissCheckoutComponent } from './kiss-checkout.component';

describe('KissCheckoutComponent', () => {
  let component: KissCheckoutComponent;
  let fixture: ComponentFixture<KissCheckoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KissCheckoutComponent]
    });
    fixture = TestBed.createComponent(KissCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
