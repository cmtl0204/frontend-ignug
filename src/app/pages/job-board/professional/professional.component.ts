import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MenuItem} from "primeng/api";
import {JobBoardHttpService, JobBoardService} from "@services/job-board";
import {MessageService} from "@services/core";
import {intervalToDuration, isBefore, isAfter} from 'date-fns';

@Component({
  selector: 'app-professional',
  templateUrl: './professional.component.html',
  styleUrls: ['./professional.component.scss']
})

export class ProfessionalComponent implements OnInit {
  selectedTab = 0;
  showOptions: boolean = false;
  options: any[] = [];
  items: MenuItem[] = [];
  activeIndex: number = 0;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private jobBoardService: JobBoardService,
              private jobBoardHttpService: JobBoardHttpService) {
    this.options = [
      {label: 'Perfil', route: 'profile', img: 'route1.png'},
      {label: 'Cursos y Capacitaciones', route: 'course', img: 'route2.png'},
      {label: 'Formación Académica', route: 'academic-formation', img: 'route3.png'},
      {label: 'Experiencia Profesional', route: 'experience', img: 'route4.png'},
      {label: 'Referencias Personales', route: 'reference', img: 'route4.png'},
      {label: 'Habilidades', route: 'skill', img: 'route4.png'},
      {label: 'Idiomas', route: 'language', img: 'route4.png'},
      {label: 'Certificado', route: '', img: 'route4.png'},
    ];
  }

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', disabled: true}
    ]);

    this.items = [
      {label: 'Perfil'},
      {label: 'Cursos y Capacitaciones'},
      {label: 'Formación Académica'},
      {label: 'Experiencias Profesionales'},
      {label: 'Referencias Profesionales'},
      {label: 'Habilidades'},
      {label: 'Idiomas'},
      {label: 'Certificado'},
    ];

    this.activeIndex = this.activatedRoute.snapshot.params.activeIndex ? this.activatedRoute.snapshot.params.activeIndex : 0;
  }

  nextPage() {

  }

  handleChange(event: any) {
    this.selectedTab = event.index;
  }

  enter(component: string) {
    this.showOptions = true;
    this.router.navigate(['/job-board/professional/' + component]);
  }

  downloadCertificate() {
    this.jobBoardHttpService.downloadCertificate(this.jobBoardService.professional.user?.username!);
  }
}
