import { Component, Input, EventEmitter, Output } from '@angular/core';
import { IBeerViewModel } from 'src/app/models';

@Component({
  selector: 'app-beer',
  templateUrl: './beer.component.html',
  styleUrls: ['./beer.component.scss'],
})
export class BeerComponent {
  @Input() beer!: IBeerViewModel;

  @Output() favoriteStatusChanged = new EventEmitter();

  public changeFavoriteStatus() {
    this.favoriteStatusChanged.emit();
  }
}
