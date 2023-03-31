import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/interfaces/dialog-data.interface';
@Component({
  selector: 'app-mensaje-espera-dialog',
  templateUrl: './mensaje-espera-dialog.component.html',
  styleUrls: ['./mensaje-espera-dialog.component.css']
})
export class MensajeEsperaDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData){}

}
