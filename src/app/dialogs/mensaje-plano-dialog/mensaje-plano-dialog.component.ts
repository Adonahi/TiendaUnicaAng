import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/interfaces/dialog-data.interface';

@Component({
  selector: 'app-mensaje-plano-dialog',
  templateUrl: './mensaje-plano-dialog.component.html',
  styleUrls: ['./mensaje-plano-dialog.component.css']
})
export class MensajePlanoDialogComponent {

  constructor(public dialog: MatDialogRef<MensajePlanoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData){}

  ok(): void {
    this.dialog.close();
  }

}
