import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeInfoPersoComponent } from './FreeInfoPersoComponent';

describe('FreeInfoPersoComponent', () => {
  let component: FreeInfoPersoComponent;
  let fixture: ComponentFixture<FreeInfoPersoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreeInfoPersoComponent],
    });
    fixture = TestBed.createComponent(FreeInfoPersoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
