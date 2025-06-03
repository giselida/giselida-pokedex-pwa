import { MatPaginatorIntl } from '@angular/material/paginator';
export class Utils {
 static percentageToHexColor(value: number): string {
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


static  ptBrPaginator(): MatPaginatorIntl {
  const intl = new MatPaginatorIntl();
  intl.itemsPerPageLabel = 'Itens por página';
  intl.nextPageLabel = 'Próxima página';
  intl.previousPageLabel = 'Página anterior';
  intl.firstPageLabel = 'Primeira página';
  intl.lastPageLabel = 'Última página';
  intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) return `0 de ${length}`;
    const start = page * pageSize + 1;
    const end = Math.min(start + pageSize - 1, length);
    return `${start}–${end} de ${length}`;
  };
  return intl;
}

}