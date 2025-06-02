import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonCard } from './pokemon-card';

describe('PokemonCard', () => {
  let component: PokemonCard;
  let fixture: ComponentFixture<PokemonCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
