import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Station } from '../model/station.type';

@Injectable({
  providedIn: 'root'
})
export class StationsService {
  httpClient = inject(HttpClient);

  getStations() {
    return this.httpClient.get<Array<Station>>('https://localhost:5000/api/stations');
  }
}
