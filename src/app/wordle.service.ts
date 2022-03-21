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

  guesses: Guess[] = []

  constructor() { }

  getPossibleAnswers(): string[] {
    return WORDS
      .filter(this.filterGrayLetters())
      .filter(this.filterGreenLetters())
      .filter(this.filterYellowLetters())
  }

  // Exclude any words containing Gray letters
  private filterGrayLetters(): (word: string) => boolean {
    const hints = this.getHints(Color.Gray)

    return (word: string) => !hints.some((hint) => word.includes(hint.letter))
  }

  // Exclude any words not containing Green letters in the right spot
  private filterGreenLetters(): (word: string) => boolean {
    const hints = this.getHints(Color.Green)

    return (word: string) => hints.every((hint) => word[hint.position] == hint.letter)
  }

  // Exclude any words not containing Yellow letters, or containing them at the yellow spot
  private filterYellowLetters(): (word: string) => boolean {
    const hints = this.getHints(Color.Yellow)

    return (word: string) => hints.every((hint) => word.includes(hint.letter) && word[hint.position] != hint.letter)
  }

  private getHints(color: Color): Hint[] {
    return this.guesses.flat().filter((hint) => hint.color == color)
  }
}
