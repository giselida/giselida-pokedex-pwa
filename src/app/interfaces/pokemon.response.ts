export interface ApiResponse<T> {
  count: number;
  next: number | null;
  previous: number | null;
  results: T[];
}

export interface PokemonPaginatedResponse {
  name: string;
  url: string;
}
export interface PokemonResponse {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities?: AbilitiesEntity[] | null;
  forms?: NamedAPIResource[] | null;
  game_indices?: GameIndexEntity[] | null;
  held_items?: HeldItemEntity[] | null;
  location_area_encounters: string;
  moves?: MoveEntity[] | null;
  species: NamedAPIResource;
  sprites: Sprites;
  cries: Cries;
  stats?: StatEntity[] | null;
  types?: TypeEntity[] | null;
  past_types?: PastTypeEntity[] | null;
  past_abilities?: PastAbilityEntity[] | null;
}

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface AbilitiesEntity {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

export interface GameIndexEntity {
  game_index: number;
  version: NamedAPIResource;
}

export interface HeldItemEntity {
  item: NamedAPIResource;
  version_details?: VersionDetailEntity[] | null;
}

export interface VersionDetailEntity {
  rarity: number;
  version: NamedAPIResource;
}

export interface MoveEntity {
  move: NamedAPIResource;
  version_group_details?: VersionGroupDetailEntity[] | null;
}

export interface VersionGroupDetailEntity {
  level_learned_at: number;
  version_group: NamedAPIResource;
  move_learn_method: NamedAPIResource;
  order: number;
}

export interface Sprites {
  back_default: string;
  back_female?: string | null;
  back_shiny: string;
  back_shiny_female?: string | null;
  front_default: string;
  front_female?: string | null;
  front_shiny: string;
  front_shiny_female?: string | null;
  other: OtherSprites;
  versions: Versions;
}

export interface OtherSprites {
  dream_world: SpriteSet;
  home: SpriteSet;
  official_artwork: ArtworkSprite;
  showdown: SpriteSet;
}

export interface ArtworkSprite {
  front_default: string;
  front_shiny: string;
}

export interface SpriteSet {
  front_default: string;
  front_female?: string | null;
  front_shiny: string;
  front_shiny_female?: string | null;
  back_default?: string;
  back_female?: string | null;
  back_shiny?: string;
  back_shiny_female?: string | null;
}

export interface Versions {
  'generation-i': GenerationSprites;
  'generation-ii': GenerationSprites;
  'generation-iii': GenerationSprites;
  'generation-iv': GenerationSprites;
  'generation-v': GenerationSprites;
  'generation-vi': GenerationSprites;
  'generation-vii': GenerationSprites;
  'generation-viii': GenerationSprites;
}

export interface GenerationSprites {
  [key: string]: any; // pode detalhar por geração se necessário
}

export interface Cries {
  latest: string;
  legacy: string;
}

export interface StatEntity {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface TypeEntity {
  slot: number;
  type: NamedAPIResource;
}

export interface PastTypeEntity {
  generation: NamedAPIResource;
  types?: TypeEntity[] | null;
}

export interface PastAbilityEntity {
  generation: NamedAPIResource;
  abilities?: PastAbilityDetail[] | null;
}

export interface PastAbilityDetail {
  ability?: NamedAPIResource | null;
  is_hidden: boolean;
  slot: number;
}

export interface ApiResponse<T> {
  count: number;
  next: number | null;
  previous: number | null;
  results: T[];
}
