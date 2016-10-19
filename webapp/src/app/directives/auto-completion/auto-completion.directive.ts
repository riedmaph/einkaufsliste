import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  OnDestroy,
  ComponentRef,
  ComponentFactoryResolver,
  ViewContainerRef,
  Renderer,
} from '@angular/core';

import { Observable } from 'rxjs';

import { AutoCompletionComponent } from './auto-completion.component';

@Directive({
  selector: '[autoCompletion]',
})
export class AutoCompletionDirective implements AfterContentInit, OnDestroy {

  @Input('openDelay')
  public openDelay: number = 100;

  @Input('closeDelay')
  public closeDelay: number = 100;

  @Input('minChars')
  public minChars: number = 2;

  @Input('autoCompletion')
  public autoCompletion: ((_: string) => Observable<string[]>) | string[] = null;


  @Output()
  public onSelect: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public onOpen: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public onClose: EventEmitter<any> = new EventEmitter<any>();

  private autoCompletionComponent: ComponentRef<AutoCompletionComponent> = null;

  private openTimeout: any = null;
  private closeTimeout: any = null;

  constructor (
    private element: ElementRef,
    private resolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer
  ) { }

  public ngAfterContentInit () {

    const factory = this.resolver.resolveComponentFactory(AutoCompletionComponent);
    this.autoCompletionComponent = this.viewContainerRef.createComponent(factory);

    const inputBB = this.element.nativeElement.getBoundingClientRect();

    this.autoCompletionComponent.location.nativeElement.style.top = inputBB.bottom + 'px';
    this.autoCompletionComponent.location.nativeElement.style.width = inputBB.width + 'px';

    this.autoCompletionComponent.instance.onSelect.subscribe((event: { value: string }) => {
      this.element.nativeElement.value = event.value;
      this.autoCompletionComponent.instance.close();
    });

    this.autoCompletionComponent.instance.onClose.subscribe(() => {
      this.onClose.emit();
    });

    this.autoCompletionComponent.instance.onOpen.subscribe(() => {
      this.onOpen.emit();
    });
  }

  public ngOnDestroy () {
    if (this.openTimeout) {
      window.clearTimeout(this.openTimeout);
    }

    if (this.closeTimeout) {
      window.clearTimeout(this.closeTimeout);
    }

    this.autoCompletionComponent.destroy();
  }

  @HostListener('keydown', [ '$event', '$event.keyCode' ])
  public onKeyUp (event: any, keyCode: number) {
    switch (keyCode) {
      case 9:
        // Tab
        if (this.autoCompletionComponent.instance.value) {
          event.preventDefault();
          this.element.nativeElement.value = this.autoCompletionComponent.instance.value;
          this.autoCompletionComponent.instance.close();
        }
        break;
      case 13:
        if (this.autoCompletionComponent.instance.value) {
          event.preventDefault();
          this.element.nativeElement.value = this.autoCompletionComponent.instance.value;
          this.autoCompletionComponent.instance.close();
          this.onSelect.emit(event);
        }
        // Enter
        break;
      case 38:
        // Up
        this.autoCompletionComponent.instance.selectPrev();
        break;
      case 40:
        // Down
        this.autoCompletionComponent.instance.open();
        this.autoCompletionComponent.instance.selectNext();
        break;
      default:
        if (this.element.nativeElement.value.length >= this.minChars - 1) {
          window.clearTimeout(this.closeTimeout);
          this.openTimeout = window.setTimeout(() => {
            if (this.autoCompletion != null && typeof this.autoCompletion === 'function') {
              this.autoCompletion(this.element.nativeElement.value)
                .subscribe((suggestions: string[]) => {
                  if (
                    Array.isArray(suggestions) &&
                    suggestions != null &&
                    suggestions
                  ) {
                    this.autoCompletionComponent.instance.suggestions = suggestions;
                    this.autoCompletionComponent.instance.open();
                  }
                }
              );
            } else if (
              Array.isArray(this.autoCompletion) &&
              this.autoCompletion != null &&
              this.autoCompletion
            ) {
              // TODO improve similarity search
              const fittingSuggestions = this.autoCompletion.filter((s: string) =>
                s.toLowerCase().startsWith(this.element.nativeElement.value.toLowerCase()));
              this.autoCompletionComponent.instance.suggestions = fittingSuggestions;
              if (fittingSuggestions.length > 0) {
                this.autoCompletionComponent.instance.open();
              }
            }
          }, this.openDelay);
        }
    }
  }

  @HostListener ('blur', [ '$event' ])
  public onBlur (event: any) {
    window.clearTimeout(this.openTimeout);
    this.closeTimeout = window.setTimeout(() => {
      this.autoCompletionComponent.instance.close();
    }, this.closeDelay);
  }

  @HostListener('window:click', [ '$event' ])
  public close (event: any) {
    window.clearTimeout(this.openTimeout);
    this.closeTimeout = window.setTimeout(() => {
      this.autoCompletionComponent.instance.close();
    }, this.closeDelay);
  }

}
