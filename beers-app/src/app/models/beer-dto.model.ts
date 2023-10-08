export interface BeerDTO {
  id: number;
  name: string;
  tagline: string;
  first_brewed: string;
  descriptioni: string;
  image_url: string;
  abv: number;
  ibu: number;
  target_fg: number;
  target_og: number;
  ebc: number;
  srm: number;
  ph: number;
  attenuation_level: number;
  volume?: ValueWithUnitsDTO;
  boil_volume?: ValueWithUnitsDTO;
  method?: BrewMethodDTO;
  ingredients: IngredientsDTO;
  food_pairing: string[];
  brewers_tips: string;
  contributed_by: string;
}

export interface ValueWithUnitsDTO {
  value: number;
  unit: string;
}

export interface BrewMethodDTO {
  mash_temp: { temp: ValueWithUnitsDTO; duration: number }[];
  fermentation: { temp: ValueWithUnitsDTO };
  twist: { temp: ValueWithUnitsDTO };
}

export interface IngredientsDTO {
  malt: {
    name: string;
    amount: ValueWithUnitsDTO;
    add?: string;
    attribute?: string;
  };
  hops: {
    name: string;
    amount: ValueWithUnitsDTO;
    add?: string;
    attribute?: string;
  };
  yeast: string;
}
