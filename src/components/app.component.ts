import {Component} from "angular2/core";
import {HeroDetailComponent} from "./hero-detail.component";
import {HeroService} from "../services/hero.service";
import {OnInit} from 'angular2/core';
import * as Rx from 'rxjs';

@Component({
  selector: 'my-app',
  styles: [require('./app.component.scss')],
  template:`
    <h1>{{title}}</h1>
    <h2>My Heroes</h2>
    <ul class="heroes">
      <li *ngFor="#hero of heroes"
        [class.selected]="hero === selectedHero"
        (click)="onSelect(hero)">
        <span class="badge">{{hero.id}}</span> {{hero.name}}
      </li>
    </ul>
    <my-hero-detail [hero]="selectedHero"></my-hero-detail>
  `,
  directives: [HeroDetailComponent],
  providers: [HeroService]
})
export class AppComponent implements OnInit {
  public title = 'Tour of Heroes';
  heroes: Hero[];
  selectedHero: Hero;

  constructor(private _heroService: HeroService) {}
  loadHeroes() {
    this._heroService.getHeroes().toArray().subscribe(data => {
      console.log('next:', data);
      this.heroes = data;
    });
  }
  ngOnInit() {
    this.loadHeroes();
  }
  onSelect(hero: Hero) { this.selectedHero = hero; }
}

interface Hero {
  id: number;
  name: string;
}
