import { BeerDTO, IBeerViewModel } from '../models';

export const BeerMapper = (beer: BeerDTO): IBeerViewModel => {
  const { id, name, image_url, abv, tagline } = beer;
  return {
    id,
    name,
    abv,
    tagline,
    image_url,
  };
};
