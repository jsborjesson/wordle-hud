import { Injectable } from '@angular/core';
import { WORDS } from './words';


export enum Color {
  Gray,
  Yellow,
  Green
}
export interface Hint {
  letter: string;
  color: Color;
  position: number;
}
export type Guess = [Hint, Hint, Hint, Hint, Hint]

export const guess = (word: string): Guess =>  {
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


@Injectable({
  providedIn: 'root'
})
export class WordleService {

  constructor() { }

  getWordle(): Guess[] {
    return [
      guess("A B O R? T"),
      guess("W? R? E? C K"),
      guess("S E! W? E! R?")
    ]
  }

  getPossibleAnswers(guesses: Guess[]): string[] {
    return WORDS
      .filter(this.filterGrayLetters(guesses))
      .filter(this.filterGreenLetters(guesses))
      .filter(this.filterYellowLetters(guesses))
  }

  // Exclude any words containing Gray letters
  private filterGrayLetters(guesses: Guess[]): (word: string) => boolean {
    const badLetters = guesses
      .flat()
      .filter((hint) => hint.color == Color.Gray)
      .map((hint) => hint.letter)

    return (word: string) => !badLetters.some((letter) => word.includes(letter))
  }

  // Exclude any words not containing Green letters in the right spot
  private filterGreenLetters(guesses: Guess[]): (word: string) => boolean {
    const fixedLetters = guesses
      .flat()
      .filter((hint) => hint.color == Color.Green)

    return (word: string) => fixedLetters.every((hint) => word[hint.position] == hint.letter)
  }

  // Exclude any words not containing Yellow letters, or containing them at the yellow spot
  private filterYellowLetters(guesses: Guess[]): (word: string) => boolean {
    const goodLetters = guesses
      .flat()
      .filter((hint) => hint.color == Color.Yellow)

    return (word: string) => goodLetters.every((hint) => word.includes(hint.letter) && word[hint.position] != hint.letter)
  }
}
