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

  // Exclude any words containing Gray letters that are not also Green
  private filterGrayLetters(): (word: string) => boolean {
    const greenLetters = this.getHints(Color.Green).map((hint) => hint.letter)
    const hints = this.getHints(Color.Gray).filter((hint) => !greenLetters.includes(hint.letter))

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
