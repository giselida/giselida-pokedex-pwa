import { inject, Injectable } from '@angular/core';
import { combineLatest, of, switchMap } from 'rxjs';
import { PokemonResponse } from '../../interfaces/pokemon.response';
import { PokeApiService } from '../poke-api/poke-api';
import { StorageService } from '../storage/storage';

@Injectable({
  providedIn: 'root',
})
export class PokeService {
  pokeApi = inject(PokeApiService);
  storage = inject(StorageService);
  count: number;

  setFavorites(favoriteIds: number[]) {
    this.storage.setItem('favorite-pokemons', favoriteIds);
  }

  getFavorites() {
    return this.storage.getItem('favorite-pokemons') ?? [];
  }

  getFavoritePokemons(pageSize: number, pageIndex: number, filter: string) {
    const storage = this.storage.getItem('pokemons') ?? [];
    const skip = pageIndex * pageSize;
    const limit = skip + pageSize;

    const data = storage.filter((item: PokemonResponse) =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
    this.count = data.length;
    return of(
      data
        .filter((item: any) => this.getFavorites().includes(item?.id))
        .slice(skip, limit)
    );
  }

  getPokemons(pageSize: number, pageIndex: number, filter: string) {
    const storage = this.storage.getItem('pokemons');
    const skip = pageIndex * pageSize;
    const limit = skip + pageSize;
    this.count = this.storage.getItem('count');

    if (storage?.length) {
      const data = storage.filter((item: PokemonResponse) =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      );
      this.count = data.length;
      return of(data.slice(skip, limit));
    }

    return this.pokeApi.getAllPokemons(pageSize, skip).pipe(
      switchMap((response) => {
        const pokemons = response.results.map((pokemon) => {
          const splittedUrl = pokemon.url.split('/');
          const id = +splittedUrl[splittedUrl.length - 2];
          return {
            id,
            ...pokemon,
          };
        });

        const detalhes = pokemons.map((item) =>
          this.pokeApi.getPokemonId(item.id)
        );

        return combineLatest(detalhes).pipe(
          switchMap((pokemonsDetalhes) => {
            return of({
              results: pokemonsDetalhes,
              count: response.count,
            });
          })
        );
      }),
      switchMap((response) => {
        const pokemons = response.results.map((pokemon) => {
          return {
            name: pokemon.name,
            id: pokemon.id,
            spriteUrl: pokemon.sprites.front_default,
            types: pokemon.types?.map((item) => item.type.name),
            abilities: pokemon.abilities?.map((item) => item.ability.name),
            height: pokemon.height,
            weight: pokemon.weight,
            baseExperience: pokemon.base_experience,
            moves: pokemon.moves?.map((item) => item.move.name),
            stats: pokemon.stats?.map((value) => {
              return {
                name: value.stat.name,
                value: value.base_stat,
              };
            }),
          };
        });
        this.storage.setItem('count', response.count);

        if (!storage?.length) this.storage.setItem('pokemons', pokemons);

        return of(pokemons);
      })
    );
  }
}
