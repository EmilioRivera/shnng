import { Component, OnInit } from '@angular/core';
import { MaterialComponent } from './material.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'dashboard',
  template: `
    <button  mat-button color="primary" (click)="openDialog()">Open Material dialog</button>
  `
})
export class DashboardComponent implements OnInit {
    private canPlay: boolean;
    constructor(private mdDialog: MatDialog) {}
    ngOnInit(): void {
        this.canPlay = true;
    }
    public openDialog(): void {
      this.mdDialog.open(MaterialComponent);
    }
}
