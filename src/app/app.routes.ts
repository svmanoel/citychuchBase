import { Routes } from '@angular/router';
import { HomeComponent } from './Component/Body/home.component';


export const routes: Routes = [
  { path: '', component: HomeComponent }, // Carga Home por defecto
  { path: '**', redirectTo: '' } // Si escriben una URL que no existe, los regresa a Home
];
