import {Injectable} from 'angular2/core';
import * as Rx from 'rxjs';

@Injectable()
export class ZundokoModel {

  private zun = Rx.Observable.of('ズン');
  private doko = Rx.Observable.of('ドコ');

  createStream() {
    const randomStream = Rx.Observable.create(observer => {
      observer.next(!Math.floor(Math.random()*2));
      observer.complete();
    });
    return randomStream.flatMap(val => (val ? this.zun : this.doko));
  }

}
