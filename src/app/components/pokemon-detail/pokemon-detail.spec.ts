import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PokemonDetailComponent } from './pokemon-detail';

describe('PokemonDetailComponent', () => {
  let component: PokemonDetailComponent;
  let fixture: ComponentFixture<PokemonDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PokemonDetailComponent,
        MatDialogModule,
        HttpClientTestingModule,
      ],
      providers: [
        provideHttpClientTesting(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 1,
            name: 'bulbasaur',
            spriteUrl:
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
            types: ['grass', 'poison'],
            abilities: ['overgrow', 'chlorophyll'],
            height: 7,
            weight: 69,
            baseExperience: 64,
            moves: [
              'razor-wind',
              'swords-dance',
              'cut',
              'bind',
              'vine-whip',
              'headbutt',
              'tackle',
              'body-slam',
              'take-down',
              'double-edge',
              'growl',
              'strength',
              'mega-drain',
              'leech-seed',
              'growth',
              'razor-leaf',
              'solar-beam',
              'poison-powder',
              'sleep-powder',
              'petal-dance',
              'string-shot',
              'toxic',
              'rage',
              'mimic',
              'double-team',
              'defense-curl',
              'light-screen',
              'reflect',
              'bide',
              'sludge',
              'skull-bash',
              'amnesia',
              'flash',
              'rest',
              'substitute',
              'snore',
              'curse',
              'protect',
              'sludge-bomb',
              'mud-slap',
              'outrage',
              'giga-drain',
              'endure',
              'charm',
              'false-swipe',
              'swagger',
              'fury-cutter',
              'attract',
              'sleep-talk',
              'return',
              'frustration',
              'safeguard',
              'sweet-scent',
              'synthesis',
              'hidden-power',
              'sunny-day',
              'rock-smash',
              'facade',
              'nature-power',
              'helping-hand',
              'ingrain',
              'knock-off',
              'secret-power',
              'weather-ball',
              'grass-whistle',
              'bullet-seed',
              'magical-leaf',
              'natural-gift',
              'worry-seed',
              'seed-bomb',
              'energy-ball',
              'leaf-storm',
              'power-whip',
              'captivate',
              'grass-knot',
              'venoshock',
              'acid-spray',
              'round',
              'echoed-voice',
              'grass-pledge',
              'work-up',
              'grassy-terrain',
              'confide',
              'grassy-glide',
              'tera-blast',
              'trailblaze',
            ],
            stats: [
              {
                name: 'hp',
                value: 45,
              },
              {
                name: 'attack',
                value: 49,
              },
              {
                name: 'defense',
                value: 49,
              },
              {
                name: 'special-attack',
                value: 65,
              },
              {
                name: 'special-defense',
                value: 65,
              },
              {
                name: 'speed',
                value: 45,
              },
            ],
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
