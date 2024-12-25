import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddbusComponent } from './addbus/addbus.component';
import { DashboardContentComponent } from './admin/dashboard-content/dashboard-content.component';
import { UpdatebusComponent } from './admin/updatebus/updatebus.component';
import { AdmindetailsComponent } from './admindetails/admindetails.component';
import { EditadminComponent } from './editadmin/editadmin.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

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
    },
    {
      path:'updatebus/:id',
      component: UpdatebusComponent
    },
    { path: 'admindetails', 
      component: AdmindetailsComponent
    },
    {
      path: 'editAdmin',
      component: EditadminComponent
    },
  
  ]
},
{ path: 'forgot-password', component: ForgotPasswordComponent },    
{ path: 'reset-password/:token', component: ResetPasswordComponent }

];
