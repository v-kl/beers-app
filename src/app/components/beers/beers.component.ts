import { Component, OnInit } from '@angular/core';
import {
  Observable,
  catchError,
  debounceTime,
  distinctUntilChanged,
  throwError,
} from 'rxjs';
import { IBeerViewModel } from 'src/app/models/beer-view.model';
import { BeerService } from 'src/app/services/beer.service';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'app-beers',
  templateUrl: './beers.component.html',
  styleUrls: ['./beers.component.scss'],
  providers: [BeerService],
})
@UntilDestroy()
export class BeersComponent implements OnInit {
  public filterField = new FormControl();
  public gridView = false;
  public loading = true;

  public beers$: Observable<IBeerViewModel[]> = this.beersService.beers$.pipe(
    catchError((err) => {
      this.loading = false;
      return throwError(() => err);
    })
  );
  constructor(private readonly beersService: BeerService) {}

  ngOnInit(): void {
    this.beersService.getBeers();
    this.filterField.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) this.beersService.filterBeers(value);
        else this.beersService.getDefaultArray();
      });
  }
  public sortBeers(ascOrder: boolean) {
    this.beersService.sortBeersByAbv(ascOrder);
  }

  public getDefaultArray() {
    this.beersService.getDefaultArray();
  }

  public onFavoriteStatusChanged(id: number) {
    this.beersService.updateFavorites(id);
  }

  public identify = (index: number, item: IBeerViewModel) => item.id;
}
