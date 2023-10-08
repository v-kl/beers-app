import { Component, OnInit } from '@angular/core';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { HttpBeerService } from 'src/app/http/beer.service';
import { IBeerViewModel } from 'src/app/models/beer-view.model';
import { BeerMapper } from 'src/app/helpers/beer-mapper';
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

  public beers$: Observable<IBeerViewModel[]> = this.beersService.beers$;
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
  public sortBeers(order: 'asc' | 'desc') {
    this.beersService.sortBeersByAbv(order);
  }

  public getDefaultArray() {
    this.beersService.getDefaultArray();
  }

  public onFavoriteStatusChanged(id: number) {
    this.beersService.updateFavorites(id);
  }
}