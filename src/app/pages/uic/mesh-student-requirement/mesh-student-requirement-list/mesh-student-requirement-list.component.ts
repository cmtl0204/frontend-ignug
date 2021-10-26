import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {UicHttpService, UicService} from '@services/uic';
import {MessageService} from '@services/core';
import {MeshStudentRequirementModel,} from '@models/uic';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-mesh-student-requirement-list',
  templateUrl: './mesh-student-requirement-list.component.html',
  styleUrls: ['./mesh-student-requirement-list.component.scss']
})

export class MeshStudentRequirementListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  progressBarDelete: boolean = false;
  meshStudentRequirements: MeshStudentRequirementModel[] = [];
  selectedMeshStudentRequirement: MeshStudentRequirementModel = {};
  selectedMeshStudentRequirements: MeshStudentRequirementModel[] = [];

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private uicHttpService: UicHttpService,
              private uicService: UicService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Requisito para malla curricular', disabled: true},
    ]);

    this.filter = new FormControl('');
  }

  ngOnInit(): void {
    this.setCols();
    this.setItems();
    this.loadMeshStudentRequirements();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadMeshStudentRequirements() {
    this.loading = true;
    this.subscriptions.push(
      this.uicHttpService.getMeshStudentRequirements(this.paginator, this.filter.value).subscribe(
        response => {
          this.loading = false;
          this.meshStudentRequirements = response.data;
          this.paginator = response.meta;
        }, error => {
          this.loading = false;
          this.messageService.error(error);
        }
      ));
  }

  filterMeshStudentRequirements(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadMeshStudentRequirements();
    }
  }

  editMeshStudentRequirement(meshStudentRequirement: MeshStudentRequirementModel) {
    this.router.navigate(['/uic/professional/academic-formation/', meshStudentRequirement.id]);
  }

  createMeshStudentRequirement() {
    this.router.navigate(['uic/professional/mesh-student-requirement/', 'new']);
  }

  selectMeshStudentRequirement(meshStudentRequirement: MeshStudentRequirementModel) {
    this.selectedMeshStudentRequirement = meshStudentRequirement;
  }

  deleteMeshStudentRequirement(meshStudentRequirement: MeshStudentRequirementModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          this.subscriptions.push(this.uicHttpService.deleteMeshStudentRequirement(meshStudentRequirement.id!)
          .subscribe(
            response => {
              this.removeMeshStudentRequirement(meshStudentRequirement);
              this.messageService.success(response);
              this.progressBarDelete = false;
            },
            error => {
              this.messageService.error(error);
              this.progressBarDelete = false;
            }
          ));
        }
      });
  }

  deleteMeshStudentRequirements(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedMeshStudentRequirements.map(element => element.id);
          this.subscriptions.push(this.uicHttpService.deleteMeshStudentRequirements(ids).subscribe(
            response => {
              this.removeMeshStudentRequirements(ids!);
              this.messageService.success(response);
              this.progressBarDelete = false;
            },
            error => {
              this.messageService.error(error);
              this.progressBarDelete = false;
            }
          ));
        }
      });

  }

  removeMeshStudentRequirement(meshStudentRequirement: MeshStudentRequirementModel) {
    this.meshStudentRequirements = this.meshStudentRequirements.filter(element => element.id !== meshStudentRequirement.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeMeshStudentRequirements(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.meshStudentRequirements = this.meshStudentRequirements.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedMeshStudentRequirements = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadMeshStudentRequirements();
  }

  setCols() {
    this.cols = [
      {field: 'meshStudent', header: 'Malla curricular'},
      {field: 'requirement', header: 'Requerimientos'},
      {field: 'approved', header: '¿Está aprobado?'},
      {field: 'observations', header: 'Observaciónes'},
    ];
  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editMeshStudentRequirement(this.selectedMeshStudentRequirement);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteMeshStudentRequirement(this.selectedMeshStudentRequirement);
        }
      }
    ];
  }
}
