import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-visualization',
  standalone: true,
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css'],
  imports: [CommonModule],
})
export class VisualizationComponent implements OnInit {
  data: any[] = [];
  private retryAttempt = 0;  // Compteur pour les tentatives de récupération
  private maxRetry = 5;  // Nombre maximum de tentatives

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.makeApiRequest()
      .subscribe({
        next: (data) => {
          this.data = data;
          console.log(data);
          this.retryAttempt = 0;  // Réinitialiser le compteur en cas de succès
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        },
      });
  }

  makeApiRequest(): Observable<any> {
    return this.dataService.getApidata().pipe(
      catchError((error) => {
        if (error.status === 429 && this.retryAttempt < this.maxRetry) {
          this.retryAttempt++;
          const retryDelay = Math.pow(2, this.retryAttempt) * 1000; // Backoff exponentiel
          console.log(`Retrying after ${retryDelay / 1000} seconds...`);
          return new Observable<void>((observer) => { // Utilisation de new Observable et typage explicite
            setTimeout(() => {
              observer.next(); // Démarrer la prochaine tentative après le délai
              observer.complete(); // Marquer la tentative comme terminée
            }, retryDelay);
          }).pipe(
            switchMap(() => this.makeApiRequest()) // Retenter après le délai
          );
        }
        return throwError(() => error);  // En cas d'erreur autre que 429, propager l'erreur
      })
    );
  }
}
