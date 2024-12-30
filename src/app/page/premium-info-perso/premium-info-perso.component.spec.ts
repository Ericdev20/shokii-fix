import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumInfoPersoComponent } from './premium-info-perso.component';

describe('PremiumInfoPersoComponent', () => {
  let component: PremiumInfoPersoComponent;
  let fixture: ComponentFixture<PremiumInfoPersoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PremiumInfoPersoComponent]
    });
    fixture = TestBed.createComponent(PremiumInfoPersoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
