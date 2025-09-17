import { Component, inject, OnInit, signal } from '@angular/core';
import { JourneysService } from '../../services/journeys.service';
import { Journey } from '../../model/journey.type';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-journeys',
  imports: [],
  templateUrl: './journeys.html',
  styleUrl: './journeys.css'
})
export class Journeys implements OnInit {
  journeyService = inject(JourneysService);
  journeys = signal<Array<Journey>>([]);

  ngOnInit(): void {
    this.journeyService
      .getJourneys()
      .pipe(
        catchError((error) => {
          console.log(error);
          throw error;
        })
      )
      .subscribe((data) => {
        this.journeys.set(data);
        console.log(this.journeys());
      });
  }
}
