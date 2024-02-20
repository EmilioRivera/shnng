import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { FileUploaderService } from './file-uploader.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('FileUploaderService', () => {
  let backend: HttpTestingController;
  let service: FileUploaderService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileUploaderService]
    });
    backend = getTestBed().get(HttpTestingController);
    service = getTestBed().get(FileUploaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
