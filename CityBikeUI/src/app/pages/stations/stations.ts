import { Component, inject, signal, OnInit } from '@angular/core';
import { StationsService } from '../../services/stations.service';
import { Station } from '../../model/station.type';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-stations',
  imports: [],
  templateUrl: './stations.html',
  styleUrl: './stations.css'
})
export class Stations implements OnInit {
  stationService = inject(StationsService);
  stations = signal<Array<Station>>([]);

  ngOnInit(): void {
    this.stationService
      .getStations()
      .pipe(
        catchError((error) => {
          console.log(error);
          throw error;
        })
      )
      .subscribe((data) => {
        this.stations.set(data);
        console.log(this.stations());
    });
  }
}
