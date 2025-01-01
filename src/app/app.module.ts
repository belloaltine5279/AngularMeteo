import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClient, HttpClientModule} from '@angular/common/http';  // Importation de HttpClientModule

import { AppComponent } from './app.component';
import { VisualizationComponent } from './components/visualization/visualization.component';
import {CommonModule} from '@angular/common';
import {DataService} from './data.service';  // Exemple

@NgModule({
  declarations: [
    AppComponent,
    VisualizationComponent,  // Assurez-vous que vos composants sont déclarés ici
  ],
  imports: [
    BrowserModule,
    HttpClientModule,// Ajout du HttpClientModule ici
    CommonModule,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
