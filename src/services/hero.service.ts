import {HEROES} from './mock-heroes';
import {Injectable} from 'angular2/core';
import * as Rx from 'rxjs';

@Injectable()
export class HeroService {
  getHeroes() {
    return Rx.Observable.fromArray(HEROES);
  }
}
