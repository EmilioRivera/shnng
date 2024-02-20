import { NgModule } from '@angular/core';
import {  MatButtonModule, MatCheckboxModule, MatSelectModule,
          MatCardModule, MatInputModule, MatDialogModule, MatSnackBarModule,
          MatSliderModule, MatProgressSpinnerModule, MatProgressBarModule,
          MatToolbarModule, MatAutocompleteModule, MatSidenavModule,
          MatListModule, MatTooltipModule, MatIconModule,
          MatTableModule } from '@angular/material';
@NgModule({
    imports: [MatButtonModule,
              MatCheckboxModule,
              MatCardModule,
              MatSelectModule,
              MatSliderModule,
              MatToolbarModule,
              MatAutocompleteModule,
              MatInputModule,
              MatProgressBarModule,
              MatProgressSpinnerModule,
              MatTooltipModule,
              MatListModule,
              MatDialogModule,
              MatSidenavModule,
              MatSnackBarModule,
              MatIconModule,
              MatTableModule],
    exports: [MatButtonModule,
              MatCheckboxModule,
              MatCardModule,
              MatSelectModule,
              MatSliderModule,
              MatToolbarModule,
              MatAutocompleteModule,
              MatInputModule,
              MatProgressBarModule,
              MatProgressSpinnerModule,
              MatTooltipModule,
              MatListModule,
              MatDialogModule,
              MatSidenavModule,
              MatSnackBarModule,
              MatIconModule,
              MatTableModule]
  })
  export class MyMaterialModule {}