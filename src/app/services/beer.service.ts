import { Injectable } from '@angular/core';
import { HttpBeerService } from '../http/beer.service';
import { BehaviorSubject, map, tap } from 'rxjs';

import { BeerMapper } from '../helpers/beer-mapper';
import { IBeerViewModel } from '../models';

@Injectable()
export class BeerService {
  private readonly beers$$ = new BehaviorSubject<IBeerViewModel[]>([]);
  public readonly beers$ = this.beers$$.asObservable();

  private beersOriginalArray: IBeerViewModel[] = [];

  private favorites: number[] = [];

  constructor(private readonly beerApi: HttpBeerService) {
    const favoriteBeers = localStorage.getItem('favoriteBeers');
    this.favorites = favoriteBeers ? JSON.parse(favoriteBeers) : [];
  }

  public getBeers() {
    return this.beerApi
      .get()
      .pipe(
        map((beers) =>
          beers
            .map(BeerMapper)
            .map((item) =>
              this.favorites?.includes(item.id)
                ? { ...item, favorite: true }
                : item
            )
        ),
        tap((beers) => {
          this.beersOriginalArray = beers;
          this.beers$$.next(beers);
        })
      )
      .subscribe();
  }

  public sortBeersByAbv(ascOrder: boolean) {
    const sortFunction = (a: IBeerViewModel, b: IBeerViewModel) =>
      ascOrder ? a.abv - b.abv : b.abv - a.abv;

    const orderedArr = [...this.beersOriginalArray].sort(sortFunction);
    this.beers$$.next(orderedArr);
  }

  public getDefaultArray() {
    this.beers$$.next(this.beersOriginalArray);
  }

  public filterBeers(filterText: string) {
    const filteredArr = [...this.beersOriginalArray].filter((beer) =>
      beer.tagline.includes(filterText)
    );
    this.beers$$.next(filteredArr);
  }

  public updateFavorites(id: number) {
    this.favorites = this.favorites.includes(id)
      ? this.favorites.filter((item) => item !== id)
      : [...this.favorites, id];

    localStorage.setItem('favoriteBeers', JSON.stringify(this.favorites));

    const previousOrderedBeersArr = this.beers$$.value;

    const updatedBeerIndex = previousOrderedBeersArr.findIndex(
      (beer) => beer.id === id
    );
    previousOrderedBeersArr[updatedBeerIndex].favorite =
      !previousOrderedBeersArr[updatedBeerIndex].favorite;

    this.beers$$.next(previousOrderedBeersArr);
  }
}
