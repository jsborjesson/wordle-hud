import { Injectable } from '@angular/core';

import { WORDS } from './words';

export enum Color {
  Gray,
  Yellow,
  Green
}
export interface Hint {
  letter: string
  color: Color
  position: number
}
export type Guess = [Hint, Hint, Hint, Hint, Hint]

@Injectable({
  providedIn: 'root'
})
export class WordleService {
  guesses: Guess[] = []

  getPossibleAnswers(): string[] {
    return WORDS
      .filter(this.filterGrayLetters())
      .filter(this.filterGreenLetters())
      .filter(this.filterYellowLetters())
  }

  makeGuess(word: string): void {
    const letters = word.split("")

    if (letters.length != 5) {
      throw new Error("Only 5 letter words are used")
    }

    const hints = this.getHints(Color.Green)

    const guess: Guess = letters.map((letter, position) => ({
      letter,
      position,
      color: hints.find((h) => h.color == Color.Green && h.position == position && h.letter == letter) ? Color.Green : Color.Gray
    })) as Guess

    this.guesses.push(guess)
  }

  // Exclude any words containing Gray letters that are not also green or yellow
  private filterGrayLetters(): (word: string) => boolean {
    const greenLetters = this.getHints(Color.Green).concat(this.getHints(Color.Yellow)).map((hint) => hint.letter)
    const hints = this.getHints(Color.Gray).filter((hint) => !greenLetters.includes(hint.letter))

    return (word: string) => !hints.some((hint) => word.includes(hint.letter))
  }

  // Exclude any words not containing green letters in the right spot
  private filterGreenLetters(): (word: string) => boolean {
    const hints = this.getHints(Color.Green)

    return (word: string) => hints.every((hint) => word[hint.position] == hint.letter)
  }

  // Exclude any words not containing yellow letters, or containing them at the yellow spot
  private filterYellowLetters(): (word: string) => boolean {
    const hints = this.getHints(Color.Yellow)

    return (word: string) => hints.every((hint) => word.includes(hint.letter) && word[hint.position] != hint.letter)
  }

  private getHints(color: Color): Hint[] {
    return this.guesses.flat().filter((hint) => hint.color == color)
  }
}
