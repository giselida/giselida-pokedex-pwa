import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  PokemonPaginatedResponse,
  PokemonResponse,
} from '../../interfaces/pokemon.response';
import { PokeApiService } from '../poke-api/poke-api';
import { StorageService } from '../storage/storage';
import { POKEMON_MOCK_RESPONSE } from './../../mocks/pokemon.response.mock';
import { PokeService } from './poke';

class StorageMock {
  private store = new Map<string, any>();
  setItem(key: string, value: any): void {
    this.store.set(key, value);
  }
  getItem(key: string): any {
    return this.store.has(key) ? this.store.get(key) : undefined;
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
}

describe('PokeService', () => {
  let service: PokeService;
  let apiSpy: jasmine.SpyObj<PokeApiService>;
  let storageMock: StorageMock;

  const basicList: { results: PokemonPaginatedResponse[]; count: number } = {
    count: 1,
    results: [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    ],
  };

  const bulbasaurDetail: PokemonResponse = {
    id: 1,
    name: 'bulbasaur',
    sprites: { front_default: 'sprite.png' } as any,
    types: [{ type: { name: 'grass' } }] as any,
    abilities: [{ ability: { name: 'overgrow' } }] as any,
    moves: [
      {
        name: 'teste',
      },
    ],
    stats: [
      {
        stat: {
          name: 'teste',
        },
        base_stat: 120,
      },
    ],
    height: 7,
    weight: 69,
    base_experience: 64,
  } as any;

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj<PokeApiService>('PokeApiService', [
      'getAllPokemons',
      'getPokemonId',
    ]);
    storageMock = new StorageMock();

    TestBed.configureTestingModule({
      providers: [
        PokeService,
        { provide: PokeApiService, useValue: apiSpy },
        { provide: StorageService, useValue: storageMock },
      ],
    });

    service = TestBed.inject(PokeService);
  });

  it('sets and retrieves favorites from storage', () => {
    service.setFavorites([1, 2, 3]);
    expect(service.getFavorites()).toEqual([1, 2, 3]);
  });
  it('sets and retrieves when is empty favorites from storage', () => {
    service['storage'].removeItem('favoritePokemons');
    expect(service.getFavorites()).toEqual([]);
  });

  it('filters favorite Pokémon correctly', () => {
    const cacheData = [
      { id: 1, name: 'bulbasaur' } as any,
      { id: 2, name: 'ivysaur' } as any,
    ];
    storageMock.setItem('favoritePokemons', [1]);
    service
      .filterFavoritePokemons({ data: cacheData, valid: true }, 'bulb', 0, 10)
      .subscribe((result) => {
        expect(result.length).toBe(1);
        expect(result[0].id).toBe(1);
      });
  });

  it('uses cache when it is still valid', fakeAsync(() => {
    const fakeCard: any = {
      id: 1,
      name: 'bulbasaur',
      spriteUrl: 'sprite.png',
      types: ['grass'],
      abilities: ['overgrow'],
      height: 7,
      weight: 69,
      baseExperience: 64,
      moves: [
        {
          name: 'teste',
        },
      ],
      stats: [
        {
          stat: {
            name: 'teste',
          },
          base_stat: 120,
        },
      ],
    };
    spyOn(service as any, 'getCachedData').and.returnValue({
      valid: true,
      data: [fakeCard],
    });
    apiSpy.getAllPokemons.and.returnValue(
      of({
        results: [fakeCard],
        count: 1,
        next: null,
        previous: null,
      })
    );
    const now = Date.now();
    storageMock.setItem(environment.CACHE_KEY, [fakeCard]);
    storageMock.setItem(environment.EXPIRATION_KEY, now + 300000);
    service
      .getPokemons({
        pageSize: 10,
        pageIndex: 0,
        filter: '',
        favoriteFilter: false,
      })
      .subscribe((result) => {
        expect(result).toEqual([fakeCard]);
      });
    expect(apiSpy.getAllPokemons).not.toHaveBeenCalled();
  }));

  it('calls the API and caches data when cache is expired', fakeAsync(() => {
    const past = Date.now() - 1000000;
    storageMock.setItem(environment.EXPIRATION_KEY, past);
    storageMock.setItem(
      environment.CACHE_KEY,
      Array.from(
        {
          length: 1200,
        },
        () => {
          return { ...POKEMON_MOCK_RESPONSE };
        }
      )
    );
    apiSpy.getAllPokemons.and.returnValue(
      of({
        count: 0,
        next: null,
        previous: null,
        results: basicList.results,
      })
    );
    apiSpy.getPokemonId.and.returnValue(of(bulbasaurDetail));

    let returnedList: any[] = [];
    service
      .getPokemons({
        pageSize: 10,
        pageIndex: 0,
        filter: '',
        favoriteFilter: false,
      })
      .subscribe((list) => (returnedList = list));

    tick();
    expect(apiSpy.getAllPokemons).toHaveBeenCalledWith(100000, 0);
    expect(apiSpy.getPokemonId).toHaveBeenCalledWith(1);
    expect(returnedList.length).toBe(1);
    expect(storageMock.getItem(environment.CACHE_KEY).length).toBe(1);
  }));
  it('calls the API and caches data when cache is expired with POKEMON_MOCK_RESPONSE', fakeAsync(() => {
    storageMock.removeItem(environment.EXPIRATION_KEY);
    storageMock.setItem(
      environment.CACHE_KEY,
      Array.from(
        {
          length: 1200,
        },
        () => {
          return { ...POKEMON_MOCK_RESPONSE };
        }
      )
    );
    apiSpy.getAllPokemons.and.returnValue(
      of({
        count: 0,
        next: null,
        previous: null,
        results: [...basicList.results, ...basicList.results],
      })
    );
    apiSpy.getPokemonId.and.returnValue(of(POKEMON_MOCK_RESPONSE as any));

    let returnedList: any[] = [];
    service
      .getPokemons({
        pageSize: 10,
        pageIndex: 0,
        filter: '',
        favoriteFilter: true,
      })
      .subscribe((list) => (returnedList = list));

    tick();
    expect(apiSpy.getAllPokemons).toHaveBeenCalledWith(100000, 0);
    expect(apiSpy.getPokemonId).toHaveBeenCalledWith(1);
    expect(returnedList.length).toBe(0);
    expect(storageMock.getItem(environment.CACHE_KEY).length).toBe(2);
  }));
  it('calls the API and caches data when cache is expired with basic', fakeAsync(() => {
    const past = Date.now() + 500;
    storageMock.setItem(environment.EXPIRATION_KEY, past);

    apiSpy.getAllPokemons.and.returnValue(
      of({
        count: 0,
        next: null,
        previous: null,
        results: [...basicList.results],
      })
    );
    apiSpy.getPokemonId.and.returnValue(
      of({
        id: 1,
        name: 'teste',
        sprites: {
          front_default: 'teste',
        },
        height: 12,
        weight: 12,
        base_experience: 12,
      } as any)
    );

    let returnedList: any[] = [];
    service
      .getPokemons({
        pageSize: 10,
        pageIndex: 0,
        filter: '',
        favoriteFilter: true,
      })
      .subscribe((list) => (returnedList = list));

    tick();
    expect(apiSpy.getAllPokemons).toHaveBeenCalledWith(100000, 0);
    expect(apiSpy.getPokemonId).toHaveBeenCalledWith(1);
    expect(returnedList.length).toBe(0);
    expect(storageMock.getItem(environment.CACHE_KEY).length).toBe(1);
  }));
});
