/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Choice = 'rock' | 'paper' | 'scissors' | 'lizard' | 'spock';

export interface GameState {
  playerChoice: Choice | null;
  computerChoice: Choice | null;
  result: 'win' | 'lose' | 'draw' | null;
  playerScore: number;
  computerScore: number;
}
