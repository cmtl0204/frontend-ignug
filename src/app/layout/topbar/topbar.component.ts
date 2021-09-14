import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {MenuHttpService} from '@services/core/menu-http.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  display = false;
  items: MenuItem[] = [];
  showNav: boolean = true;

  constructor(private menuHttpService: MenuHttpService) {
  }

  ngOnInit(): void {
    // this.getMenus();
  }

  getMenus() {
    this.menuHttpService.getMenus().subscribe(
      response => {
        this.items = response.data;
      }, error => {
        console.log(error);
      }
    )
  }
}
