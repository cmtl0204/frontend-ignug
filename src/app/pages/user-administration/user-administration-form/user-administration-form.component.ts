import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CatalogueModel, UserModel} from '../../../models';
import {UserAdministrationHttpService} from '../../../services/user-administration-http.service';
import {MessageService} from '../../../services/message.service';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-user-administration-form',
  templateUrl: './user-administration-form.component.html',
  styleUrls: ['./user-administration-form.component.scss']
})
export class UserAdministrationFormComponent implements OnInit {
  @Input() user: UserModel = {};
  @Output() userNewOrUpdate = new EventEmitter<UserModel>();

  formUser: FormGroup;
  automaticPassword: FormControl;
  progressBar: boolean = false;
  identificationTypes: CatalogueModel[] = [];
  telephoneOperators: CatalogueModel[] = [];

  constructor(private formBuilder: FormBuilder,
              private userAdministrationHttpService: UserAdministrationHttpService,
              public messageService: MessageService) {
    this.formUser = this.newFormUser();
    this.automaticPassword = this.formBuilder.control(false);
  }

  ngOnInit(): void {
    this.formUser.patchValue(this.user);
    if (this.idField.value) {
      this.passwordField.setValidators([]);
    }
    this.getIdentificationTypes();
  }

  newFormUser() {
    return this.formBuilder.group({
      id: [null],
      identificationType: [null, [Validators.required]],
      // identificationType: this.formBuilder.group({
      //   name: [null, [Validators.required]],
      //   description: [null]
      // }),
      username: [null, [Validators.required]],
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      passwordChange: [false],
      phones: this.formBuilder.array([
        this.formBuilder.group({
          operator: [null, [Validators.required]],
          type: [null, [Validators.required]],
          location: [null, [Validators.required]],
          number: [null, [Validators.required]],
          main: [false],
        })
      ]),
    });
  }

  getIdentificationTypes() {
    this.userAdministrationHttpService.getCatalogues('IDENTIFICATION_TYPE').subscribe(
      response => {
        this.identificationTypes = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  getTelephoneOperators() {
    this.userAdministrationHttpService.getCatalogues('TELEPHONE_OPERATOR').subscribe(
      response => {
        this.telephoneOperators = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  onSubmit() {
    console.log(this.formUser);
    if (this.formUser.valid) {
      if (this.idField.value) {
        this.updateUser(this.formUser.value);
      } else {
        this.storeUser(this.formUser.value);
      }
    } else {
      this.formUser.markAllAsTouched();
    }
  }

  storeUser(user: UserModel): void {

    this.progressBar = true;
    this.userAdministrationHttpService.storeUser(user).subscribe(
      response => {
        this.messageService.success(response);
        this.formUser.reset();
        this.userNewOrUpdate.emit(user);
        this.progressBar = false;
      },
      error => {
        this.messageService.error(error);
        this.progressBar = false;
      }
    );
  }

  updateUser(user: UserModel): void {
    this.progressBar = true;
    this.userAdministrationHttpService.updateUser(user.id, user).subscribe(
      response => {
        this.messageService.success(response);
        this.formUser.reset();
        this.userNewOrUpdate.emit(user);
        this.progressBar = false;
      },
      error => {
        this.messageService.error(error);
        this.progressBar = false;
      }
    );
  }

  generateAutomaticPassword(event: any) {
    this.automaticPassword.setValue(event.checked);
    if (event.checked) {
      this.passwordField.setValue(Math.random().toString(36).slice(-8));
    }
  }

  get idField() {
    return this.formUser.controls['id'];
  }

  get identificationTypeField() {
    return this.formUser.controls['identificationType'];
  }

  get usernameField() {
    return this.formUser.controls['username'];
  }

  get nameField() {
    return this.formUser.controls['name'];
  }

  get lastnameField() {
    return this.formUser.controls['lastname'];
  }

  get emailField() {
    return this.formUser.controls['email'];
  }

  get passwordField() {
    return this.formUser.controls['password'];
  }

  get passwordChangeField() {
    return this.formUser.controls['passwordChange'];
  }

  get phonesField() {
    return this.formUser.controls['phones'] as FormArray;
  }
}
