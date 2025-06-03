import { Component, inject, input } from '@angular/core';
import { PokeService } from '../../services/poke/poke';

@Component({
  selector: 'star',
  imports: [],
  templateUrl: './star.html',
  styleUrl: './star.scss',
})
export class StarComponent {
  pokeService = inject(PokeService);

  id = input<number | undefined>(undefined);

  onFavoritePokemon(id: number) {
    let favoriteIds = this.pokeService.favoriteIds();

    let items = [...favoriteIds];
    if (!items.includes(id)) {
      items.push(id);
    } else {
      items = items.filter((item) => item != id);
    }
    this.pokeService.favoriteIds.set(items);
    this.pokeService.setFavorites(items);
  }
}
