import { inject, Injectable } from '@angular/core';
import { Journey } from '../model/journey.type';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JourneysService {
  httpClient = inject(HttpClient);

  getJourneys() {
    return this.httpClient.get<Array<Journey>>('https://localhost:5000/api/journeys');
  }
}
