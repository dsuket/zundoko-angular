import {Component} from "angular2/core";
import * as Rx from 'rxjs';

@Component({
  selector: 'kiyoshi',
  styles: [require('./kiyoshi.component.scss')],
  template:`
  <div class="kiyoshi-check rank-{{rank}}">
    <h2>キヨシチェック</h2>
    <div class="form-panel">
      <button (click)="start($event)">start</button>
      <button (click)="stop($event)">stop</button>
      Speed: <input type="range" max="1000" min="100" step="10" [(ngModel)]="speed"> {{speed}}
    </div>
    <div class="zundoko-container">
      <div class="zundoko-item" *ngFor="#item of items$ | async">{{item}} </div>
    </div>
    <span class="kiyoshi" [hidden]="!showKiyoshi">＼キ・ヨ・シ！／</span>
  </div>
  `,
})

export class KiyoshiComponent {
  // model
  private zun$ = Rx.Observable.of('ズン');
  private doko$ = Rx.Observable.of('ドコ');
  private items$;

  // intent
  private start$;
  private stop$;

  // view properties
  private rank = 0;
  private speed = 400;
  private showKiyoshi = false;
  private subscription;
  private items = [];

  constructor() {
    this.start$ = new Rx.Subject();
    this.stop$ = new Rx.Subject();

    this.start$
      .startWith({})
      .subscribe(ev => this.onStart());
    this.stop$
      .subscribe(ev => this.onStop());
  }

  createZundokoStream() {
    const randomStream = Rx.Observable.create(observer => {
      observer.next(!Math.floor(Math.random()*2));
      observer.complete();
    });
    return randomStream.flatMap(val => (val ? this.zun$ : this.doko$));
  }

  createKiyoshiStream() {
    const zundokoStream = this.createZundokoStream();
    return Rx.Observable.interval(this.speed)
      .mergeMapTo(zundokoStream)
      .do(x => this.addItem(x))
      .bufferCount(5, 1)
      .takeWhile(val => val.join('') !== 'ズンズンズンズンドコ');
  }

  addItem(item) {
    this.items.push(item);
    this.updateItems$();
  }
  cleatItems() {
    this.items = [];
    this.showKiyoshi = false;
    this.rank = 0;
    this.updateItems$();
  }

  updateItems$() {
    const itemStream = Rx.Observable.fromArray(this.items);
    itemStream.subscribe(x => {
      console.log('x:', x);
      if (x === 'ドコ') {
        this.rank = 0;
      } else {
        this.rank = this.rank > 3 ? 4 : this.rank + 1;
      }
    });
    this.items$ = itemStream.toArray();
  }

  // start handler
  start($event) {
    this.start$.next($event);
  }

  // stop handler
  stop($event) {
    this.stop$.next($event);
  }

  // start subscriber
  onStart() {
    this.stop({});
    this.cleatItems();
    const kiyoshiStream = this.createKiyoshiStream();
    this.subscription = kiyoshiStream
      .subscribe({
        next: () =>  {},
        error: err => console.log('Error: ', err),
        complete: () => {
          this.showKiyoshi = true;
          this.rank = 5;
        },
      });
  }

  // stop subscriber
  onStop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = null;
  }

}
