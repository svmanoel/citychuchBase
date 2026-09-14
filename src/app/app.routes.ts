import { Routes } from '@angular/router';
import { HomeComponent } from './Component/Body/home.component';
import { AboutComponent } from './Component/Body/About/about.component';


export const routes: Routes = [
  { path: '', component: HomeComponent }, // Carga Home por defecto
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' } // Si escriben una URL que no existe, los regresa a Home

];
