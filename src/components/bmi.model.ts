import {EventEmitter} from "events";
import {Injectable} from "angular2/core";

@Injectable()
export class BmiModel {
  private bmiMessage = new EventEmitter();

  public _weight = 62;
  public _height = 170;

  constructor() {}

  get bmi() {
    const heightMeters = this._height * 0.01;
    return Math.round(this._weight / (heightMeters * heightMeters));
  }

  set weight(w) {
    this._weight = w;
  }
  get weight() {
    return this._weight;
  }
  set height(h) {
    this._height = h;
  }
  get height() {
    return this._height;
  }

}
