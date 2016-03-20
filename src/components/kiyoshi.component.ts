import {Component} from "angular2/core";
import * as Rx from 'rxjs';
import {ZundokoModel} from "./zundoko.model";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'kiyoshi',
  styles: [require('./kiyoshi.component.scss')],
  template:`
  <div class="kiyoshi-check rank-{{rank}}" (keydown)="keydown($event)" tabindex="1">
    <h2>キヨシチェック</h2>
    <div class="form-panel">
      <button (click)="start()">start</button>
      <button (click)="stop()">stop</button>
      Speed: <input type="range" max="1000" min="100" step="10" [(ngModel)]="speed"> {{speed}}
    </div>
    <div class="zundoko-container">
      <div class="zundoko-item" *ngFor="#item of items">{{item}} </div>
    </div>
    <span class="kiyoshi" [hidden]="!kiyoshi">＼キ・ヨ・シ！／</span>
  </div>
  `,
  providers: [ZundokoModel]
})

export class KiyoshiComponent {
  private items;
  private kiyoshi;
  private rank;
  private speed = 500;
  private subscriber;
  private subscription;
  private zundokoSubject;

  constructor(private model: ZundokoModel) {
    this.subscriber = this.createSubscriber();
    this.start();
  }

  keydown(event) {
    console.log('event', event);
    switch(event.code) {
      case 'KeyZ':
        this.zundokoSubject.next('ズン');
        break;
      case 'KeyD':
        this.zundokoSubject.next('ドコ');
        break;
    }
  }

  start() {
    this.kiyoshi = false;
    this.rank = 0;
    this.items = [];
    this.stop();
    const zundokoStream = this.model.createStream();
    const kiyoshiStream = this.createIntervalStream()
      .mergeMap(() => {
        this.zundokoSubject = new Rx.Subject();
        return zundokoStream.merge(this.zundokoSubject);
      })
      .do(x => this.updateZundoko(x))
      .bufferCount(5, 1)
      .takeWhile(val => val.join('') !== 'ズンズンズンズンドコ');

    this.subscription = kiyoshiStream.subscribe(this.subscriber);
  }

  updateZundoko(x) {
    this.items.push(x);
    if (x === 'ドコ') {
      this.rank = 0;
    } else {
      this.rank = this.rank > 3 ? 4 : this.rank + 1;
    }
  }

  stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = null;
  }

  createIntervalStream() {
    const self = this;
    return Rx.Observable.create(subsriber => {
      let count = 0;
      let isStop = false;
      function timer() {
        setTimeout(() => {
          if (isStop) {
            return;
          }
          subsriber.next(count++);
          console.log('timer', count);
          timer();
        }, self.speed)
      }
      timer();
      return function() {
        isStop = true;
      };
    })
  }

  createSubscriber() {
    return {
      next: () => {},
      error: err => console.error('Error', err),
      complete: () => {
        this.kiyoshi = true;
        this.rank = 5;
      },
    };
  }
}
