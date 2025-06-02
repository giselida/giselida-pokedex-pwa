import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { PokemonCard } from '../../interfaces/pokemon-card';
import {
  PokemonPaginatedResponse,
  PokemonResponse,
} from '../../interfaces/pokemon.response';
import { PokeApiService } from '../poke-api/poke-api';
import { StorageService } from '../storage/storage';

@Injectable({ providedIn: 'root' })
export class PokeService {
  private readonly pokeApi = inject(PokeApiService);
  private readonly storage = inject(StorageService);

  count = 0;
  private readonly FIVE_MINUTES = 5 * 60 * 1000;

  setFavorites(favoriteIds: number[]) {
    this.storage.setItem('favorite-pokemons', favoriteIds);
  }

  getFavorites(): number[] {
    return this.storage.getItem('favorite-pokemons') ?? [];
  }

  getFavoritePokemons(
    pageSize: number,
    pageIndex: number,
    filter: string
  ): Observable<PokemonCard[]> {
    const all = (this.storage.getItem(environment.CACHE_KEY) ??
      []) as PokemonCard[];
    const favorites = this.getFavorites();
    const filtered = all.filter(
      (p) =>
        p.name.toLowerCase().includes(filter.toLowerCase()) &&
        favorites.includes(p.id)
    );

    this.count = filtered.length;
    return of(filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize));
  }

  getPokemons(
    pageSize: number,
    pageIndex: number,
    filter: string
  ): Observable<PokemonCard[]> {
    const cache = this.getCachedData();
    if (cache.valid) {
      const filtered = cache.data.filter((p) =>
        p.name.toLowerCase().includes(filter.toLowerCase())
      );
      this.count = filtered.length;
      return of(
        filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
      );
    }

    return this.fetchBasicData(pageSize, pageIndex).pipe(
      switchMap((basic) => this.enrichData(basic)),
      map((response) => this.storeAndFormat(response))
    );
  }

  private getCachedData(): { data: PokemonCard[]; valid: boolean } {
    const data = this.storage.getItem(environment.CACHE_KEY) as PokemonCard[];
    const expiration = this.storage.getItem(environment.EXPIRATION_KEY);
    const isValid = data?.length && expiration && Date.now() < expiration;
    return { data: data ?? [], valid: !!isValid };
  }

  private fetchBasicData(
    pageSize: number,
    pageIndex: number
  ): Observable<{ results: PokemonPaginatedResponse[]; count: number }> {
    const skip = pageSize * pageIndex;
    return this.pokeApi.getAllPokemons(pageSize, skip);
  }

  private enrichData(paginated: {
    results: PokemonPaginatedResponse[];
    count: number;
  }): Observable<{ results: PokemonResponse[]; count: number }> {
    const withIds = paginated.results.map((p) => ({
      ...p,
      id: +p.url.split('/').slice(-2)[0],
    }));

    const details$ = withIds.map((p) => this.pokeApi.getPokemonId(p.id));
    return combineLatest(details$).pipe(
      map((results) => ({ results, count: paginated.count }))
    );
  }

  private storeAndFormat(response: {
    results: PokemonResponse[];
    count: number;
  }): PokemonCard[] {
    const formatted = response.results.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      spriteUrl: pokemon.sprites.front_default,
      types: pokemon.types?.map((t) => t.type.name) ?? [],
      abilities: pokemon.abilities?.map((a) => a.ability.name) ?? [],
      height: pokemon.height,
      weight: pokemon.weight,
      baseExperience: pokemon.base_experience,
      moves: pokemon.moves?.map((m) => m.move.name) ?? [],
      stats:
        pokemon.stats?.map((s) => ({
          name: s.stat.name,
          value: s.base_stat,
        })) ?? [],
    }));

    const sorted = formatted.sort((a, b) => a.id - b.id);
    const now = Date.now();

    this.storage.setItem('count', response.count);
    this.storage.setItem('createAt', now);
    this.storage.setItem(environment.CACHE_KEY, sorted);
    this.storage.setItem(environment.EXPIRATION_KEY, now + this.FIVE_MINUTES);

    return sorted as PokemonCard[];
  }
}
