import { MatPaginatorIntl } from '@angular/material/paginator';
import { Utils } from './utils';

describe('Utils', () => {
  describe('percentageToHexColor', () => {
    it('returns pure red at 0 %', () => {
      expect(Utils.percentageToHexColor(0)).toBe('#ff0000');
    });

    it('returns an orange tone at 25 %', () => {
      expect(Utils.percentageToHexColor(25)).toBe('#ff7100');
    });

    it('returns yellow at 50 %', () => {
      expect(Utils.percentageToHexColor(50)).toBe('#ffff00');
    });

    it('returns a lime-green tone at 75 %', () => {
      expect(Utils.percentageToHexColor(75)).toBe('#80ff00');
    });

    it('returns pure green at 100 %', () => {
      expect(Utils.percentageToHexColor(100)).toBe('#00ff00');
    });

    it('caps values above 100 % to pure green', () => {
      expect(Utils.percentageToHexColor(110)).toBe('#00ff00');
    });
  });

  describe('ptBrPaginator', () => {
    let paginator: MatPaginatorIntl;

    beforeEach(() => {
      paginator = Utils.ptBrPaginator();
    });

    it('sets all Portuguese labels', () => {
      expect(paginator.itemsPerPageLabel).toBe('Itens por página');
      expect(paginator.nextPageLabel).toBe('Próxima página');
      expect(paginator.previousPageLabel).toBe('Página anterior');
      expect(paginator.firstPageLabel).toBe('Primeira página');
      expect(paginator.lastPageLabel).toBe('Última página');
    });

    it('formats range label when there are no items', () => {
      expect(paginator.getRangeLabel(0, 10, 0)).toBe('0 de 0');
    });

    it('formats range label for a non-empty page', () => {
      expect(paginator.getRangeLabel(1, 10, 35)).toBe('11–20 de 35');
    });
  });
});
