import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, viewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { HeightPipe } from '../pipes/height/height-pipe';
import { WeightPipe } from '../pipes/weight/weight-pipe';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card';
@Component({
  selector: 'app-pokemon-detail',
  imports: [
    PokemonCardComponent,
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

  percentageToHexColor(value: number): string {
    if (value > 100) value = 100;
    const redConversion = Math.round(510 - 5.1 * value);
    const greenConversion = Math.round(4.5 * value);
    const maxValue = 255;

    let green = maxValue;
    let red = redConversion;
    let blue = 0;

    if (value < 50) {
      red = maxValue;
      green = greenConversion;
    }
    let hexadecimal: string | number =
      red * 0x10000 + green * 0x100 + blue * 0x1;
    hexadecimal = '000000' + hexadecimal.toString(16);
    hexadecimal = '#' + hexadecimal.slice(-6);

    return hexadecimal;
  }
}
