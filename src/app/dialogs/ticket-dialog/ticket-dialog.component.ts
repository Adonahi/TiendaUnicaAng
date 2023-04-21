import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogData } from 'src/app/interfaces/dialog-data.interface';

@Component({
  selector: 'app-ticket-dialog',
  templateUrl: './ticket-dialog.component.html',
  styleUrls: ['./ticket-dialog.component.css']
})
export class TicketDialogComponent {

  displayedColumns: string[] = [
    'numero',
    'nombre',
    'precio_unitario',
    'cantidad',
    'precio_total'
  ];
  dataSource = new MatTableDataSource();

  fecha = "";
  precio_total = 0;

  constructor(public dialog: MatDialogRef<TicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.dataSource.data = data.contenido;
        this.precio_total = data.contenido[0].precio_total;
        this.fecha = data.contenido[0].fecha;
     }

  ok(): void {
    this.dialog.close();
  }

}
