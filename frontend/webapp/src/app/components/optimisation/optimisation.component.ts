import { Component } from '@angular/core';

import { OptimisedList } from '../../models';

@Component({
  templateUrl: 'optimisation.template.html',
  styleUrls: [ 'optimisation.style.scss' ],
})
export class OptimisationComponent {

  public optimisedList: OptimisedList = null;
}
