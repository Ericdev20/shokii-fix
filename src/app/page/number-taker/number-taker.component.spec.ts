import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberTakerComponent } from './number-taker.component';

describe('NumberTakerComponent', () => {
  let component: NumberTakerComponent;
  let fixture: ComponentFixture<NumberTakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberTakerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberTakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
