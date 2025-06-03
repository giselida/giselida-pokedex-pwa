import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment.development';
import {
  ApiResponse,
  PokemonPaginatedResponse,
  PokemonResponse,
} from '../../interfaces/pokemon.response';
import { PokeApiService } from './poke-api';

describe('PokeApiService', () => {
  let service: PokeApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokeApiService],
    });
    service = TestBed.inject(PokeApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('calls the correct URL and returns a paginated list', () => {
    const fakePaginatedResponse: ApiResponse<PokemonPaginatedResponse> = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'test', url: 'test' }],
    };

    service.getAllPokemons(25, 2).subscribe((response) => {
      expect(response).toEqual(fakePaginatedResponse);
    });

    const req = httpMock.expectOne(
      `${environment.API_URL}/pokemon?limit=25&offset=2`
    );
    expect(req.request.method).toBe('GET');
    req.flush(fakePaginatedResponse);
  });
  it('calls the correct URL and returns a paginated list', () => {
    const fakePaginatedResponse: ApiResponse<PokemonPaginatedResponse> = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'test', url: 'test' }],
    };

    service.getAllPokemons(20).subscribe((response) => {
      expect(response).toEqual(fakePaginatedResponse);
    });

    const req = httpMock.expectOne(
      `${environment.API_URL}/pokemon?limit=20&offset=0`
    );
    expect(req.request.method).toBe('GET');
    req.flush(fakePaginatedResponse);
  });

  it('calls the correct URL and returns a single Pokémon', () => {
    const fakePokemon: PokemonResponse = {
      id: 6,
      name: 'charizard',
    } as PokemonResponse;

    service.getPokemonId(6).subscribe((response) => {
      expect(response).toEqual(fakePokemon);
    });

    const req = httpMock.expectOne(`${environment.API_URL}/pokemon/6`);
    expect(req.request.method).toBe('GET');
    req.flush(fakePokemon);
  });
});
