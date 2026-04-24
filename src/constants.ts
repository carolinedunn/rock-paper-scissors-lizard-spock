import { Choice } from './types';

export const CHOICES: Choice[] = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

export const RULES: Record<Choice, Choice[]> = {
  rock: ['scissors', 'lizard'],
  paper: ['rock', 'spock'],
  scissors: ['paper', 'lizard'],
  lizard: ['spock', 'paper'],
  spock: ['scissors', 'rock'],
};

export const VERBS: Record<string, string> = {
  'scissors-paper': 'cuts',
  'paper-rock': 'covers',
  'rock-lizard': 'crushes',
  'lizard-spock': 'poisons',
  'spock-scissors': 'smashes',
  'scissors-lizard': 'decapitates',
  'lizard-paper': 'eats',
  'paper-spock': 'disproves',
  'spock-rock': 'vaporizes',
  'rock-scissors': 'crushes',
};
