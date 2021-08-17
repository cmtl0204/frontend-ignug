import {Directive, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {AbstractControl, ValidationErrors} from '@angular/forms';

@Directive({
  selector: '[appErrorMessage]'
})
export class ErrorMessageDirective {

  @Input()
  set appErrorMessage(val: AbstractControl | null) {
    this.updateView(val);
  }

  constructor(private templateRef: TemplateRef<HTMLElement>,
              private viewContainerRef: ViewContainerRef,
              private rendered2: Renderer2) {
    console.log(templateRef);
  }

  private updateView(val: AbstractControl | null) {
    this.viewContainerRef.clear();

    // if (val?.invalid && this.valid()) {
    this.viewContainerRef.createEmbeddedView(this.templateRef);
    this.setRequired();
    // }
  }

  private valid() {
    return true;
  }

  private setRequired() {
    const element = this.templateRef.elementRef.nativeElement;
    this.rendered2.setStyle(element,'color','red');
    // element.style.color = 'red';
    // element.innerText = 'red';
  }
}
