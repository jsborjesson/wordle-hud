import { Component } from '@angular/core';
import { Color, Guess, WordleService } from './wordle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'wordle-hud';
  newGuess = '';

  constructor(private wordleService: WordleService) {}

  makeGuess(word: string) {
    this.wordleService.makeGuess(word)
    this.newGuess = ''
  }

  changeColor(guess: number, hint: number) {
    const clickedHint = this.wordleService.guesses[guess][hint]
    clickedHint.color = (clickedHint.color + 1) % 3
  }

  reset() {
    this.wordleService.guesses = []
  }

  getGuesses() {
    return this.wordleService.guesses
  }

  getPossibleAnswers() {
    return this.wordleService.getPossibleAnswers()
  }
}
