import { Routes } from '@angular/router';
import { HomeComponent } from './Component/Body/Home/home.component';
import { AboutComponent } from './Component/Body/About/about.component';
import { ConnectComponent } from './Component/Body/connect/connect.component';
import { ServicesComponent } from './Component/Body/services/services.component';
import { TeamComponent } from './Component/Body/team/team.component';
import { BeliefsComponent } from './Component/Body/beliefs/beliefs.component';
import { FaqsComponent } from './Component/Body/faqs/faqs.component';


export const routes: Routes = [
  { path: '', component: HomeComponent }, // load Home by default
  { path: 'about', component: AboutComponent }, // load about section 
  { path: 'team', component: TeamComponent }, // load out team section 
  { path: 'connect', component: ConnectComponent },// load the diferents groups
  { path: 'services', component: ServicesComponent },// load the diferents sevices
  { path: 'beliefs', component: BeliefsComponent },// load the our beliefs
  { path: 'faqs', component: FaqsComponent },// load the frequents questions 


  { path: '**', redirectTo: '' } // any invalid url  back to home
  

];
