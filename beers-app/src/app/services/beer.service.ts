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

  constructor(private readonly beerApi: HttpBeerService) {}

  public getBeers() {
    return this.beerApi
      .get()
      .pipe(
        map((beers) => beers.map(BeerMapper)),
        tap((beers) => {
          this.beersOriginalArray = beers;
          this.beers$$.next(beers);
        })
      )
      .subscribe();
  }

  public sortBeersByAbv(order: 'asc' | 'desc') {
    const sortFunction =
      order === 'asc'
        ? (a: IBeerViewModel, b: IBeerViewModel) => a.abv - b.abv
        : (a: IBeerViewModel, b: IBeerViewModel) => b.abv - a.abv;
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
}
