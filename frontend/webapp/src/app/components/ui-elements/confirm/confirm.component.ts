import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'sl-confirm',
  template: `
    <p>Are you sure?</p>
    <p>
      <button md-button (click)="dialogRef.close(false)">Cancel</button>
      <button md-button (click)="dialogRef.close(true)">{{ action }}</button>
    </p>
  `,
  styleUrls: [ 'confirm.style.scss' ],
 })

export class ConfirmComponent {

  public action: string = 'Delete';

  constructor(public dialogRef: MdDialogRef<ConfirmComponent>) { }

}
