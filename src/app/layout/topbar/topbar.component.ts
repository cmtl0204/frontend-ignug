import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  display = false;
  items: MenuItem[] = [];

  constructor() {
    this.items = [

    ];
  }

    ngOnInit()
  :
    void {}

  }
