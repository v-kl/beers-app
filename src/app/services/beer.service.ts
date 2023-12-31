import { Injectable } from '@angular/core';
import { HttpBeerService } from '../http/beer.service';
import { BehaviorSubject, catchError, map, tap, throwError } from 'rxjs';

import { BeerMapper } from '../helpers/beer-mapper';
import { IBeerViewModel } from '../models';
import { STORAGE_KEYS } from '../const/local-storage-keys';

@Injectable()
export class BeerService {
  private readonly beers$$ = new BehaviorSubject<IBeerViewModel[]>([]);
  public readonly beers$ = this.beers$$.asObservable();

  private beersOriginalArray: IBeerViewModel[] = [];

  private favorites: number[] = [];

  constructor(private readonly beerApi: HttpBeerService) {
    const favoriteBeers = localStorage.getItem(STORAGE_KEYS.FAVORITE_BEERS);
    this.favorites = favoriteBeers ? JSON.parse(favoriteBeers) : [];
    if (favoriteBeers) {
      try {
        this.favorites = JSON.parse(favoriteBeers);
      } catch (err) {
        console.error(err);
      }
    }
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
        }),
        catchError((err) => {
          this.beers$$.error(err);
          return throwError(() => err);
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
    const filteredArr = this.beersOriginalArray.filter((beer) =>
      beer.tagline.toLowerCase().includes(filterText.toLowerCase())
    );
    this.beers$$.next(filteredArr);
  }

  public updateFavorites(id: number) {
    const isFavorite = this.favorites.includes(id);
    this.favorites = isFavorite
      ? this.favorites.filter((item) => item !== id)
      : [...this.favorites, id];

    localStorage.setItem(
      STORAGE_KEYS.FAVORITE_BEERS,
      JSON.stringify(this.favorites)
    );

    const previousOrderedBeersArr = this.beers$$.value;

    const updatedBeerIndex = previousOrderedBeersArr.findIndex(
      (beer) => beer.id === id
    );
    const updatedBeerFavoritesArr = [...previousOrderedBeersArr];
    updatedBeerFavoritesArr[updatedBeerIndex].favorite = !isFavorite;

    this.beers$$.next(updatedBeerFavoritesArr);
  }
}
