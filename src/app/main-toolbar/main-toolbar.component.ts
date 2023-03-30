import { Component, OnInit } from '@angular/core';

import {MatSnackBar} from '@angular/material/snack-bar';
import { MENSAJES } from './mensajes';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styles: ['.active{ background-color: #621982; }']
})
export class MainToolbarComponent implements OnInit{

  constructor(
    private _snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    
  }

  lanzarSnackBar(){
    this._snackBar.open(MENSAJES[Math.floor(Math.random() * 7)], undefined, { duration: 1500})
  }

}