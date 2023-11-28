import { TestBed } from '@angular/core/testing';

import { AccomondationService } from './accomondation.service';

describe('AccomondationService', () => {
  let service: AccomondationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccomondationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
