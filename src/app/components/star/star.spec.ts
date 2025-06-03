import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PokeService } from '../../services/poke/poke';
import { StarComponent } from './star';

class PokeServiceStub {
  favoriteIds: WritableSignal<number[]> = signal([]);
  setFavorites = jasmine.createSpy('setFavorites');
}

describe('StarComponent', () => {
  let serviceStub: PokeServiceStub;

  function createComponent() {
    TestBed.configureTestingModule({
      imports: [StarComponent, HttpClientTestingModule],
      providers: [{ provide: PokeService, useClass: PokeServiceStub }],
    });
    serviceStub = TestBed.inject(PokeService) as unknown as PokeServiceStub;
    return TestBed.createComponent(StarComponent).componentInstance;
  }

  it('adds the id to favorites when it is not yet present', () => {
    const component = createComponent();
    component.onFavoritePokemon(42);

    expect(serviceStub.favoriteIds()).toEqual([42]);
    expect(serviceStub.setFavorites).toHaveBeenCalledWith([42]);
  });

  it('removes the id from favorites when it is already present', () => {
    const component = createComponent();
    serviceStub.favoriteIds.set([42, 99]);

    component.onFavoritePokemon(42);

    expect(serviceStub.favoriteIds()).toEqual([99]);
    expect(serviceStub.setFavorites).toHaveBeenCalledWith([99]);
  });
});
