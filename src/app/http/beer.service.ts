import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BeerDTO } from '../models/beer-dto.model';

@Injectable({
  providedIn: 'root',
})
export class HttpBeerService {
  constructor(private httpClient: HttpClient) {}

  public get(): Observable<BeerDTO[]> {
    return this.httpClient.get<BeerDTO[]>(`https://api.punkapi.com/v2/beers`);
  }
}
