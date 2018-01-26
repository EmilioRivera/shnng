import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueComponent } from './issue.component';
import { DashboardComponent } from './dashboard.component';

import { MaterialComponent } from './material.component';
// TODO : Put the right paths
const routes: Routes = [
  { path: 'material', component: MaterialComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'issue', component: IssueComponent },
  { path: '', redirectTo: 'material', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
