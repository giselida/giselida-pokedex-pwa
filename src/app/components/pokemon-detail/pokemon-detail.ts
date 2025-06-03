import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, viewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { HeightPipe } from '../../pipes/height/height-pipe';
import { WeightPipe } from '../../pipes/weight/weight-pipe';
import { Utils } from '../../shared/utils';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card';
import { StarComponent } from '../star/star';
@Component({
  standalone: true,
  selector: 'pokemon-detail',
  imports: [
    PokemonCardComponent,
    StarComponent,
    TitleCasePipe,
    MatTabsModule,
    HeightPipe,
    WeightPipe,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.scss',
})
export class PokemonDetailComponent {
  pokemon = inject(MAT_DIALOG_DATA);

  paginator = viewChild(MatPaginator);

  dataSource = computed(() => {
    const data = new MatTableDataSource(this.pokemon.moves);
    const paginator = this.paginator();
    if (paginator) data.paginator = paginator;
    return data;
  });

  percentageToHexColor = Utils.percentageToHexColor;
}
