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
import { Product } from '../../models';

@Directive({
  selector: '[autoCompletion]',
})
export class AutoCompletionDirective implements AfterContentInit, OnDestroy {

  @Input()
  @HostBinding('attr.openDelay')
  public openDelay: number = 200;

  @Input()
  @HostBinding('attr.closeDelay')
  public closeDelay: number = 200;

  @Input()
  @HostBinding('attr.minChars')
  public minChars: number = 3;

  @Output()
  public onSelect: EventEmitter<Product> = new EventEmitter<Product>();

  @Output()
  public onValueChange: EventEmitter<Product> = new EventEmitter<Product>();

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
    private renderer: Renderer,
  ) { }

  /**
   * Origin of the suggestions
   * @type { ((_: string) => Observable<string[]>)}
   */
  @Input()
  public autoCompletion: ((_: string) => Observable<Product[]>) = () => null;

  /**
   * Generates the auto-completion list component, positions it at the host element
   *
   * @return {void}
   */
  public ngAfterContentInit (): void {
    this.element.nativeElement.setAttribute('autocomplete', 'off');

    const factory = this.resolver.resolveComponentFactory(AutoCompletionComponent);
    this.autoCompletionComponent = this.viewContainerRef.createComponent(factory);

    this.resizeAutoCompletion();

    this.autoCompletionComponent.instance.onSelect
      .subscribe((suggestion: Product) => {
        this.element.nativeElement.value = suggestion;
        this.autoCompletionComponent.instance.close();
        this.onValueChange.emit(suggestion);
      });

    this.autoCompletionComponent.instance.onClose.subscribe((e: any) => {
      this.onClose.emit(e);
    });

    this.autoCompletionComponent.instance.onOpen.subscribe((e: any) => {
      this.onOpen.emit(e);
    });
  }

  /** Repeatedly updates the size and position of the suggestion-list */
  public resizeAutoCompletion (): void {
    if (this && this.autoCompletionComponent) {
      const inputBB = this.element.nativeElement.getBoundingClientRect();
      this.autoCompletionComponent.location.nativeElement.style.bottom = inputBB.height + 'px';
      this.autoCompletionComponent.location.nativeElement.style.width = inputBB.width + 'px';
      const alignLeft = 'calc(' + inputBB.left + 'px - 1rem)';
      this.autoCompletionComponent.location.nativeElement.style.left = alignLeft;
    }
    window.requestAnimationFrame(() => this.resizeAutoCompletion());
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
   * Tab enters the selected auto-completion value into the input
   *
   * @param {KeyboardEvent} event triggering keyboard event
   * @param {number} keyCode pressed key
   * @return {void}
   */
  @HostListener('keydown', [ '$event', '$event.keyCode' ])
  public onKeyDown (event: KeyboardEvent, keyCode: number): void {
    if (keyCode === 9) {
      // Tab
      if (this.autoCompletionComponent.instance.value) {
        event.preventDefault();
        this.element.nativeElement.value = this.autoCompletionComponent.instance.value;
        this.autoCompletionComponent.instance.close();
        this.onValueChange.emit(this.element.nativeElement.value);
      }
    }
  }

  /**
   * Handles keyboard events:
   * - Enter does the same as tab in `onKeyDown` but also emits the onSelect Event
   * - Up and down select next and prev entries in the auto-completion list respectively
   * - All other keys trigger auto-completion to look for new suggestions
   *
   * @see AutoCompletionDirective.onKeyDown
   * @param {KeyboardEvent} event triggering keyboard event
   * @param {number} keyCode pressed key
   * @return {void}
   */
  @HostListener('keyup', [ '$event', '$event.keyCode' ])
  public onKeyUp (event: KeyboardEvent, keyCode: number): void {
    event.preventDefault();
    switch (keyCode) {
      case 13:
        // Enter
        event.preventDefault();
        if (this.autoCompletionComponent.instance.value) {
          this.element.nativeElement.value = this.autoCompletionComponent.instance.value;
          this.autoCompletionComponent.instance.close();
          this.onValueChange.emit(this.element.nativeElement.value);
          this.onSelect.emit(
            this.autoCompletionComponent.instance.value,
          );
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
            this.autoCompletionComponent.instance.loading = true;
            this.autoCompletion(this.element.nativeElement.value)
              .subscribe((suggestions: Product[]) => {
                this.autoCompletionComponent.instance.loading = false;
                if (
                  suggestions != null &&
                  Array.isArray(suggestions)
                ) {
                  this.autoCompletionComponent.instance.suggestions = suggestions;
                  this.autoCompletionComponent.instance.open();
                }
              }
            );
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
    if (keyCode === 27) {
      this.autoCompletionComponent.instance.close();
    }
  }

}
