import { Routes } from '@angular/router';
import { HomeComponent } from './Component/Body/home.component';
import { AboutComponent } from './Component/Body/About/about.component';
import { ConnectComponent } from './Component/Body/connect/connect.component';
import { ServicesComponent } from './Component/Body/services/services.component';


export const routes: Routes = [
  { path: '', component: HomeComponent }, // Carga Home por defecto
  { path: 'about', component: AboutComponent }, // carga la pagina con inforomacion acerca de la iglesia
  { path: 'connect', component: ConnectComponent },// Carga los diferentres grupos
  { path: 'services', component: ServicesComponent },
  { path: '**', redirectTo: '' } // Si escriben una URL que no existe, los regresa a Home
  

];
