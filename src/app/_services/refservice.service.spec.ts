import {inject, TestBed} from '@angular/core/testing';

import {RefserviceService} from './refservice.service';

describe('RefserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefserviceService]
    });
  });

  it('should be created', inject([RefserviceService], (service: RefserviceService) => {
    expect(service).toBeTruthy();
  }));
});
