import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
  ApiResponse,
  PokemonPaginatedResponse,
  PokemonResponse,
} from '../../interfaces/pokemon.response';

@Injectable({
  providedIn: 'root',
})
export class PokeApiService {
  http = inject(HttpClient);

  getAllPokemons(pageSize: number, page: number = 0) {
    return this.http.get<ApiResponse<PokemonPaginatedResponse>>(
      `${environment.API_URL}/pokemon?limit=${pageSize}&offset=${page}`
    );
  }
  getPokemonId(id: number) {
    return this.http.get<PokemonResponse>(
      `${environment.API_URL}/pokemon/${id}`
    );
  }
}
