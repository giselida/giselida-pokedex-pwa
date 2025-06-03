import { signal } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingService } from '../../services/loading/loading';
import { PokedexComponent } from './pokedex';

class LoadingServiceStub {
  loading = signal(false);
}

describe('PokedexComponent', () => {
  function createComponent() {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, PokedexComponent],
      providers: [{ provide: LoadingService, useClass: LoadingServiceStub }],
    });
    return TestBed.createComponent(PokedexComponent);
  }

  it('emits debounced search term and resets page', fakeAsync(() => {
    const fixture = createComponent();
    const component = fixture.componentInstance;
    spyOn(component, 'currentPageSize').and.returnValue(12);
    spyOn(component, 'count').and.returnValue(12);

    component.isFirstPage();
    component.isLastPage();
    component.totalPages();

    component.ngOnInit();
    spyOn(component.searchType, 'emit');
    spyOn(component.pageIndex, 'emit');

    component.name.setValue('bulbasaur');
    tick(501);

    expect(component.searchType.emit).toHaveBeenCalledWith('bulbasaur');
    expect(component.pageIndex.emit).toHaveBeenCalledWith(0);
  }));

  it('emitPage sends page size and resets page index', () => {
    const fixture = createComponent();
    const component = fixture.componentInstance;

    spyOn(component.pageSize, 'emit');
    spyOn(component.pageIndex, 'emit');

    component.emitPage(50);

    expect(component.pageSize.emit).toHaveBeenCalledWith(50);
    expect(component.pageIndex.emit).toHaveBeenCalledWith(0);
    expect(component.currentPageIndex()).toBe(0);
  });

  it('favoriteFilterEvent toggles filter, emits value and resets page', () => {
    const fixture = createComponent();
    const component = fixture.componentInstance;

    spyOn(component.favoriteFilter, 'emit');
    spyOn(component.pageIndex, 'emit');

    component.favoriteFilterEvent();

    expect(component.currentFavoriteFilterValue()).toBeTrue();
    expect(component.favoriteFilter.emit).toHaveBeenCalledWith(true);
    expect(component.pageIndex.emit).toHaveBeenCalledWith(0);
  });

  it('nextPage updates index and emits, respecting upper bound', () => {
    const fixture = createComponent();
    const component = fixture.componentInstance;

    spyOn(component.pageIndex, 'emit');
    spyOn(component, 'totalPages').and.returnValue(10);
    component.nextPage();
    expect(component.currentPageIndex()).toBe(1);
    expect(component.pageIndex.emit).toHaveBeenCalledWith(1);

    component.nextPage();
    expect(component.currentPageIndex()).toBe(2);
  });

  it('previewPage updates index and emits, respecting lower bound', () => {
    const fixture = createComponent();
    const component = fixture.componentInstance;

    component.currentPageIndex.set(2);

    spyOn(component.pageIndex, 'emit');

    component.previewPage();
    expect(component.currentPageIndex()).toBe(1);
    expect(component.pageIndex.emit).toHaveBeenCalledWith(1);

    component.previewPage();
    component.previewPage(); // tenta ir abaixo de zero
    expect(component.currentPageIndex()).toBe(0);
  });

  it('goToLastPage sets index to final page and emits', () => {
    const fixture = createComponent();
    const component = fixture.componentInstance;

    spyOn(component.pageIndex, 'emit');

    component.goToLastPage();

    expect(component.currentPageIndex()).toBe(-1);
    expect(component.pageIndex.emit).toHaveBeenCalledWith(-1);
  });

  it('goToFirstPage resets page index and emits zero', () => {
    const fixture = createComponent();
    const component = fixture.componentInstance;

    component.currentPageIndex.set(3);
    spyOn(component.pageIndex, 'emit');

    component.goToFirstPage();

    expect(component.currentPageIndex()).toBe(0);
    expect(component.pageIndex.emit).toHaveBeenCalledWith(0);
  });
});
