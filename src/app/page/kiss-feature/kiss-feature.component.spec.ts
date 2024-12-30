import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KissFeatureComponent } from './kiss-feature.component';

describe('KissFeatureComponent', () => {
  let component: KissFeatureComponent;
  let fixture: ComponentFixture<KissFeatureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KissFeatureComponent]
    });
    fixture = TestBed.createComponent(KissFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
