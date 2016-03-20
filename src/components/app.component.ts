import {Component} from "angular2/core";
import {KiyoshiComponent} from "./kiyoshi.component";

@Component({
  selector: 'my-app',
  template:`
    <div class="components">
      <kiyoshi></kiyoshi>
    </div>
  `,
  directives: [KiyoshiComponent],
})

export class AppComponent {}
