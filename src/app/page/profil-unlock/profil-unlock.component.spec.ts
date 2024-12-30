import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilUnlockComponent } from './profil-unlock.component';

describe('ProfilUnlockComponent', () => {
  let component: ProfilUnlockComponent;
  let fixture: ComponentFixture<ProfilUnlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilUnlockComponent]
    });
    fixture = TestBed.createComponent(ProfilUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
