import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule'
  },
  { path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  {
    path: 'tabs',
    loadChildren: './tabs/tabs.module#TabsPageModule'
  }
  ,
  {
    path: 'tabs/receive/details',
    loadChildren: './mail-detail/mail-detail.module#MailDetailPageModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }