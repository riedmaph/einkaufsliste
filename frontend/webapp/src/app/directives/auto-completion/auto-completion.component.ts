import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { Product } from '../../models';

@Component({
  selector: 'auto-completion',
  templateUrl: './auto-completion.template.html',
  styleUrls: [ './auto-completion.style.scss' ],
})
export class AutoCompletionComponent {

  @Output()
  public onOpen: EventEmitter<any> = new EventEmitter();

  @Output()
  public onClose: EventEmitter<any> = new EventEmitter();

  @Output()
  public onValueChanged: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public onSelect: EventEmitter<any> = new EventEmitter<any>();

  public loading: boolean = false;

  private isOpenFlag: boolean = false;

  private suggestionList: Product[] = [ ];

  private selectedIndex: number = -1;

  public get isOpen (): boolean {
    return this.isOpenFlag;
  }

  public get suggestions (): Product[] {
    return this.suggestionList;
  }

  @Input()
  public set suggestions (suggestions: Product[]) {
    this.suggestionList = suggestions;
    this.selectedIndex = -1;
    this.onValueChanged.emit();
  }

  public selectNext (): void {
    if (this.suggestions) {
      if (this.selectedIndex < 0) {
        this.selectedIndex = 0;
      } else {
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
      }
      this.onValueChanged.emit();
    }
  }

  public selectPrev (): void {
    if (this.suggestions) {
      if (this.selectedIndex < 0) {
        this.selectedIndex = this.suggestions.length - 1;
      } else {
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      }
      this.onValueChanged.emit();
    }
  }

  public get value (): Product {
    return (this.selectedIndex < 0 ? null : this.suggestions[this.selectedIndex]);
  }

  public open (): void {
    this.isOpenFlag = true;
    this.onOpen.emit();
  }

  public close (): void {
    this.isOpenFlag = false;
    this.onClose.emit();
  }

  public select (event: MouseEvent | KeyboardEvent, suggestion: Product) {
    console.info('AC Component', suggestion);
    this.onSelect.emit({ event: event, suggestion: suggestion });
  }

}
