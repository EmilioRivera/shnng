import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueComponent } from './components/issue.component';
import { DashboardComponent } from './components/dashboard.component';

import { MaterialComponent } from './components/material.component';
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
