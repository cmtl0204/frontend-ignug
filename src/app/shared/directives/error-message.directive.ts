import {Directive, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {AbstractControl, ValidationErrors} from '@angular/forms';

@Directive({
  selector: '[appErrorMessage]'
})
export class ErrorMessageDirective {

  @Input()
  set appErrorMessage(val: AbstractControl | null) {
    this.updateView();
  }

  constructor(private templateRef: TemplateRef<HTMLElement>,
              private viewContainerRef: ViewContainerRef,
              private elementRef: ElementRef) {
    console.log(templateRef);
    console.log(elementRef);
  }

  private updateView() {
    this.setRequired();
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }


  private setRequired() {
    const element = this.templateRef.elementRef.nativeElement;
    console.log(element);
    element.style.color = 'red';
    element.innerText = 'red';
  }
}
