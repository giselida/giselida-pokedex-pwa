import { inject, Injectable, signal } from '@angular/core';
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
  favoriteIds = signal<number[]>([]);

  count = 0;
  private readonly FIVE_MINUTES = 5 * 60 * 1000;

  setFavorites(favoriteIds: number[]) {
    this.storage.setItem('favoritePokemons', favoriteIds);
  }

  getFavorites(): number[] {
    return this.storage.getItem('favoritePokemons') ?? [];
  }

  filterFavoritePokemons(
    cache: { data: PokemonCard[]; valid: boolean },
    filter: string,
    pageIndex: number,
    pageSize: number
  ): Observable<PokemonCard[]> {
    const favorites = this.getFavorites();
    const filtered = cache.data.filter(
      (p) =>
        p.name.toLowerCase().includes(filter.toLowerCase()) &&
        favorites.includes(p.id)
    );

    this.count = filtered.length;
    return of(filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize));
  }

  getPokemons({
    pageSize,
    pageIndex,
    filter,
    favoriteFilter,
  }: {
    pageSize: number;
    pageIndex: number;
    filter: string;
    favoriteFilter: boolean;
  }) {
    const cache = this.getCachedData();
    const predicateFn = favoriteFilter
      ? this.filterFavoritePokemons.bind(this)
      : this.filterCacheData.bind(this);
    if (cache.valid) {
      return predicateFn(cache, filter, pageIndex, pageSize);
    } else {
      return this.getPokemonsData(100000, 0).pipe(
        switchMap((response) =>
          predicateFn(
            {
              data: response,
              valid: true,
            },
            filter,
            pageIndex,
            pageSize
          )
        )
      );
    }
  }

  private filterCacheData(
    cache: { data: PokemonCard[]; valid: boolean },
    filter: string,
    pageIndex: number,
    pageSize: number
  ) {
    const filtered = cache.data.filter((p) =>
      p.name.toLowerCase().includes(filter.toLowerCase())
    );
    this.count = filtered.length;
    return of(filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize));
  }

  private getPokemonsData(
    pageSize: number,
    pageIndex: number
  ): Observable<PokemonCard[]> {
    return this.fetchBasicData(pageSize, pageIndex).pipe(
      switchMap((basic) => this.enrichData(basic)),
      map((response) => this.storeAndFormat(response))
    );
  }

  private getCachedData(): { data: PokemonCard[]; valid: boolean } {
    const data = this.storage.getItem(environment.CACHE_KEY) as PokemonCard[];
    const expiration = this.storage.getItem(environment.EXPIRATION_KEY);
    const isValid = data?.length > 900 && expiration && Date.now() < expiration;
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
      abilities: pokemon.abilities?.map((a) => a.ability?.name) ?? [],
      height: pokemon.height,
      weight: pokemon.weight,
      baseExperience: pokemon.base_experience,
      moves: pokemon.moves?.map((m) => m.move?.name) ?? [],
      stats:
        pokemon.stats?.map((s) => ({
          name: s?.stat?.name,
          value: s?.base_stat,
        })) ?? [],
    }));

    const sorted = formatted.toSorted((a, b) => a.id - b.id);
    const now = Date.now();

    this.storage.setItem('count', response.count);
    this.storage.setItem('createAt', now);
    this.storage.setItem(environment.CACHE_KEY, sorted);
    this.storage.setItem(environment.EXPIRATION_KEY, now + this.FIVE_MINUTES);

    return sorted as PokemonCard[];
  }
}
