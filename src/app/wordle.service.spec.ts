import { TestBed } from '@angular/core/testing';

import { WordleService, Guess, Color } from './wordle.service';

const guess = (word: string): Guess =>  {
  const letters = word.split(" ")

  if (letters.length != 5) {
    throw new Error("Only 5 letter words are used")
  }

  return letters.map((shorthand, position) => {
    const [letter, colorChar] = shorthand.toLowerCase()

    switch (colorChar) {
      case "?":
        return { position, letter, color: Color.Yellow }
      case "!":
        return { position, letter, color: Color.Green }
      default:
        return { position, letter, color: Color.Gray }
    }
  }) as Guess
}

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
    service.guesses = [
      guess("F R? U I! T?"),
      guess("T! I? R? E? D"),
    ]

    expect(service.getPossibleAnswers()).toEqual(['their'])
  });

  it('should not filter gray letters that are also green', () => {
    service.guesses = [
      guess("W E A R S?"),
      guess("V I S? I T"),
      guess("S! P O! O N"),
      guess("S! H? O! C K")
    ]

    expect(service.getPossibleAnswers()).toEqual(['slosh'])
  });
});
