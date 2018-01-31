import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MyMaterialModule } from './my-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormStatusPipe } from './form-status.pipe';
import { IssueComponent } from './issue.component';
import { MaterialComponent } from './material.component';
import { DashboardComponent } from './dashboard.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { HService } from './h.service';
import { HttpClientModule } from '@angular/common/http';
import { SimpleHttpServiceService } from './simple-http-service.service';

@NgModule({
  declarations: [
    AppComponent, MaterialComponent, DashboardComponent, IssueComponent, FormStatusPipe
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MyMaterialModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [HService, SimpleHttpServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
