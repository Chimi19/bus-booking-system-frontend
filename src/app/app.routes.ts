import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddbusComponent } from './addbus/addbus.component';
import { DashboardContentComponent } from './admin/dashboard-content/dashboard-content.component';

export const routes: Routes = [
  { path: '', component: SignupComponent }, // Default route
{ path: 'signup', component: SignupComponent },
{ path: 'login', component: LoginComponent },

{ 
  path: 'dashboard', 
  component: DashboardComponent, 
  children:[
    {
      path: '',
      component: DashboardContentComponent
    },
    {
      path: 'dashboard-content',
      component: DashboardContentComponent
    },
    {
      path: 'addbus',
      component: AddbusComponent
    }
  ]
},

];
