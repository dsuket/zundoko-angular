import {Component} from "angular2/core";
import * as Rx from 'rxjs';
import {BmiModel} from "./bmi.model";

@Component({
  selector: 'bmi',
  styles: [`
    .label {
      display: inline-block;
      width: 64px;
    }
  `],
  template:`
    <div>
      <div class="weight">
        <div class="label">Weight: </div>        
        <input id="#weight" type="range" min="40" max="140" [(ngModel)]="model.weight">
        {{model.weight}} kg
      </div>
      <div class="height">
        <div class="label">Height: </div>        
        <input id="#height" type="range" min="140" max="210" [(ngModel)]="model.height">
        {{model.height}} cm
      </div>
      <h2>BMI is {{model.bmi}}</h2>
    </div>
  `,
  // directives: [HeroDetailComponent],
  // providers: [HeroService]
})

export class BmiComponent {
  model = new BmiModel(60, 170);

  constructor() {
  }

}
