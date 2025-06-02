import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { PokemonCard } from '../../interfaces/pokemon-card';

@Component({
  imports: [TitleCasePipe],
  selector: 'pokemon-card',
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.scss',
})
export class PokemonCardComponent {
  pokemonInput = input<PokemonCard | undefined>(undefined, {
    alias: 'pokemon',
  });
  isShiny = input(false);
  nameIsVisible = input(true);
}
