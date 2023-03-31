import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/interfaces/dialog-data.interface';

@Component({
  selector: 'app-mensaje-si-no-dialog',
  templateUrl: './mensaje-si-no-dialog.component.html',
  styleUrls: ['./mensaje-si-no-dialog.component.css']
})
export class MensajeSiNoDialogComponent {

  constructor(public dialog: MatDialogRef<MensajeSiNoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  si(): void {
    this.dialog.close(true);
  }

  no(): void{
    this.dialog.close(false);
  }
}
