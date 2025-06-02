import { DialogModule } from '@angular/cdk/dialog';
import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { PokedexComponent } from '../../components/pokedex/pokedex';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card';
import { PokemonDetailComponent } from '../../components/pokemon-detail/pokemon-detail';
import { PokemonCard } from '../../interfaces/pokemon-card';
import { PokeService } from '../../services/poke/poke';

@Component({
  imports: [
    PokemonCardComponent,
    PokedexComponent,
    DialogModule,
    MatButtonModule,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit {
  pokeService = inject(PokeService);
  pokemons: WritableSignal<PokemonCard[]> = signal([]);
  filter: WritableSignal<string> = signal('');
  favoriteIds = signal<number[]>([]);
  favoriteFilter = signal<boolean>(false);
  pageIndex = signal<number>(0);
  pageSize = signal<number>(10000);
  dialogService = inject(MatDialog);

  ngOnInit(): void {
    this.favoriteIds.set(this.pokeService.getFavorites());
    this.getPokemons();
  }

  onFilterPage(name: string) {
    this.filter.set(name);
    this.getPokemons();
  }
  onOpenDialog(pokemon: PokemonCard) {
    this.dialogService.open(PokemonDetailComponent, {
      data: pokemon,
      height: '600px',
      width: '600px',
    });
  }
  onPageChange(pageSize: number) {
    this.pageSize.set(pageSize);
    this.getPokemons();
  }
  onFavoriteFilterChange(favoriteFilter: boolean) {
    this.favoriteFilter.set(favoriteFilter);
    this.getPokemons();
  }
  onPageIndexChange(pageIndex: number) {
    this.pageIndex.set(pageIndex);
    this.getPokemons();
  }

  onFavoritePokemon(id: number) {
    let favoriteIds = this.favoriteIds();
    if (!favoriteIds.includes(id)) {
      favoriteIds.push(id);
    } else {
      favoriteIds = favoriteIds.filter((item) => item != id);
    }
    this.favoriteIds.set(favoriteIds);
    this.pokeService.setFavorites(this.favoriteIds());
  }
  private getPokemons() {
    const method = this.favoriteFilter()
      ? 'getFavoritePokemons'
      : 'getPokemons';

    this.pokeService[method](
      this.pageSize(),
      this.pageIndex(),
      this.filter()
    ).subscribe(this.pokemons.set);
  }
}
