import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MyMaterialModule } from './my-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';

import { FormStatusPipe } from './pipes/form-status.pipe';
import { IssueComponent } from './components/issue.component';
import { MaterialComponent } from './components/material.component';
import { DashboardComponent } from './components/dashboard.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { HService } from './services/h.service';
import { HttpClientModule } from '@angular/common/http';
import { SimpleHttpService } from './services/simple-http.service';
import { PositionExtractorDirective } from './position-extractor.directive';
import { FileUploaderService } from './services/file-uploader.service';
@NgModule({
  declarations: [
    AppComponent, MaterialComponent, DashboardComponent, IssueComponent, FormStatusPipe, PositionExtractorDirective
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
  providers: [HService, SimpleHttpService, FileUploaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
