import { Component, Optional } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'sl-confirm',
  template: `
    <p>Are you sure?</p>
    <p>
      <button md-button (click)="dialogRef.close(false)">Cancel</button>
      <button md-button (click)="dialogRef.close(true)">Delete</button>
    </p>
  `,
  styleUrls: [ 'confirm.style.scss' ],
})
export class ConfirmComponent {
  constructor(@Optional() public dialogRef: MdDialogRef<ConfirmComponent>) { }
}
