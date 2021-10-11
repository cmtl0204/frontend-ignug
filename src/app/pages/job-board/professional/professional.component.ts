import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BreadcrumbService} from '@services/core/breadcrumb.service';

@Component({
  selector: 'app-professional',
  templateUrl: './professional.component.html',
  styleUrls: ['./professional.component.scss']
})
export class ProfessionalComponent implements OnInit {
  selectedTab = 0;
  showOptions: boolean = false;
  options: any[] = [];

  constructor(private router: Router, private breadcrumbService: BreadcrumbService) {
    this.options = [
      {label: 'Perfil', route: 'profile', img: 'route1.png'},
      {label: 'Cursos', route: 'course', img: 'route2.png'},
      {label: 'Formación Académica', route: 'academic-formation', img: 'route3.png'},
      {label: 'Experiencia Profesional', route: 'experience', img: 'route4.png'},
      {label: 'Referencias Personales', route: 'reference', img: 'route4.png'},
      {label: 'Habilidades', route: 'skill', img: 'route4.png'},
      {label: 'Idiomas', route: 'language', img: 'route4.png'},
    ];
  }

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', disabled: true}
    ]);
  }

  handleChange(event: any) {
    this.selectedTab = event.index;
  }

  enter(component: string) {
    this.showOptions = true;
    this.router.navigate(['/job-board/professional/' + component]);
  }
}
