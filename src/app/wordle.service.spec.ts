import { TestBed } from '@angular/core/testing';

import { WordleService, guess } from './wordle.service';

describe('WordleService', () => {
  let service: WordleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should filter down words', () => {
    const guesses = [
      guess("F R? U I! T?"),
      guess("T! I? R? E? D"),
    ]

    expect(service.getPossibleAnswers(guesses)).toEqual(['their'])
  });
});
