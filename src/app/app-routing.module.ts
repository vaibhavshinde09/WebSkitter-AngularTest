import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/authentication/login/login.component';
import { RegisterComponent } from './component/authentication/register/register.component';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('./component/User/user.module').then(m => m.UserModule),
    canActivate:[AuthGuard]
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
 
  { path: '**',   redirectTo: '/login', pathMatch: 'full' },
  { path: '',   redirectTo: '/login', pathMatch: 'full' }, // 

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
