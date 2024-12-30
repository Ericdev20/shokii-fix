import { TestBed } from '@angular/core/testing';

import { KissService } from './kiss.service';

describe('KissService', () => {
  let service: KissService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KissService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
