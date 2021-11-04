import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-techstatevsn',
  templateUrl: './techstatevsn.component.html',
  styleUrls: ['./techstatevsn.component.css']
})
export class TechstatevsnComponent implements OnInit {

  @Inject(MAT_DIALOG_DATA) public data: any

  constructor() { }

  ngOnInit(): void {
  }

}
