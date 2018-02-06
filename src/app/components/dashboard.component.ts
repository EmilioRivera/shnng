import { Component, OnInit } from '@angular/core';
import { MaterialComponent } from './material.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-dashboard',
  template: `
    <button  mat-button color="primary" (click)="openDialog()">Open Material dialog</button>
  `
})
export class DashboardComponent implements OnInit {
    private canPlay: boolean;
    public constructor(private mdDialog: MatDialog) {}
    public ngOnInit(): void {
        this.canPlay = true;
    }
    public openDialog(): void {
      this.mdDialog.open(MaterialComponent);
    }
}
