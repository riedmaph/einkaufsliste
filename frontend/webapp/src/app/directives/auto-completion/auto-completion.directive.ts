import {
  Directive,
  ElementRef,
  HostListener,
  HostBinding,
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

  @Input()
  @HostBinding('attr.openDelay')
  public openDelay: number = 100;

  @Input()
  @HostBinding('attr.closeDelay')
  public closeDelay: number = 100;

  @Input()
  @HostBinding('attr.minChars')
  public minChars: number = 2;

  /**
   * Origin of the suggestions
   * @type { ((_: string) => Observable<string[]>) | string[]}
   */
  @Input()
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

  /**
   * Generates the auto-completion list component, positions it at the host element
   *
   * @return {void}
   */
  public ngAfterContentInit (): void {
    const factory = this.resolver.resolveComponentFactory(AutoCompletionComponent);
    this.autoCompletionComponent = this.viewContainerRef.createComponent(factory);

    window.addEventListener('resize', this.resizeAutoCompletion(this.autoCompletionComponent));
    this.resizeAutoCompletion(this.autoCompletionComponent)();

    this.autoCompletionComponent.instance.onSelect.subscribe((event: { value: string }) => {
      this.element.nativeElement.value = event.value;
      this.autoCompletionComponent.instance.close();
    });

    this.autoCompletionComponent.instance.onClose.subscribe((e: any) => {
      this.onClose.emit(e);
    });

    this.autoCompletionComponent.instance.onOpen.subscribe((e: any) => {
      this.onOpen.emit(e);
    });
  }

  /**
   * @return {() => void} Event handler function that resizes the auto-completion list
   */
  public resizeAutoCompletion (component): () => void {
    return () => {
      if (component) {
        const inputBB = this.element.nativeElement.getBoundingClientRect();
        component.location.nativeElement.style.bottom = inputBB.height + 'px';
        component.location.nativeElement.style.width = inputBB.width + 'px';
      }
    };
  }

  /**
   * Remove timeouts and destroy component
   *
   * @return {void}
   */
  public ngOnDestroy (): void {
    if (this.openTimeout) {
      window.clearTimeout(this.openTimeout);
    }

    if (this.closeTimeout) {
      window.clearTimeout(this.closeTimeout);
    }

    this.autoCompletionComponent.destroy();
  }

  /**
   * Handles keyboard events:
   * - Tab enters the selected auto-completion value into the input
   * - Enter does the same as tab but also emits the onSelect Event
   * - Up and down select next and prev entries in the auto-completion list respectively
   * - All other keys trigger auto-completion to look for new suggestions
   *
   * @param {KeyboardEvent} event triggering keyboard event
   * @param {number} keyCode pressed key
   * @return {void}
   */
  @HostListener('keydown', [ '$event', '$event.keyCode' ])
  public onKeyUp (event: KeyboardEvent, keyCode: number): void {
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
        // Enter
        if (this.autoCompletionComponent.instance.value) {
          event.preventDefault();
          this.element.nativeElement.value = this.autoCompletionComponent.instance.value;
          this.autoCompletionComponent.instance.close();
          this.onSelect.emit(event);
        }
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
        if (this.element.nativeElement.value.length >= this.minChars) {
          window.clearTimeout(this.closeTimeout);
          this.openTimeout = window.setTimeout(() => {
            if (this.autoCompletion != null && typeof this.autoCompletion === 'function') {
              this.autoCompletionComponent.instance.loading = true;
              this.autoCompletion(this.element.nativeElement.value)
                .subscribe((suggestions: string[]) => {
                  this.autoCompletionComponent.instance.loading = true;
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
              this.autoCompletion.length
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
        } else {
          this.autoCompletionComponent.instance.close();
        }
    }
  }

  /**
   * Resets the close timeout, closes the suggestion list after `closeDelay` ms
   *
   * @return {void}
   */
  @HostListener ('blur')
  @HostListener('window:click')
  public close (): void {
    window.clearTimeout(this.openTimeout);
    this.closeTimeout = window.setTimeout(() => {
      this.autoCompletionComponent.instance.close();
    }, this.closeDelay);
  }

  /**
   * Closes the autoCompletionComponent without delay
   * @return {void}
   */
  @HostListener('window:keyup', [ '$event', '$event.keyCode' ])
  public closeImmediate (event: KeyboardEvent, keyCode?: number): void {
    if (keyCode && keyCode === 27) {
      this.autoCompletionComponent.instance.close();
    }
  }

}
