import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {TriviaPage} from '../trivia/trivia';

import {SWAPI} from '../../providers/swapi';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loading: boolean = true;
  intro: boolean = false;

  constructor(public navCtrl: NavController, public swapi: SWAPI) {

    swapi.sync(() => {
      setTimeout(() => {
        this.loading = false;
      }, 5000);
    });

    setTimeout(() => {
      this.intro = true;
    }, 30000);

  }

  start() {
    this.navCtrl.push(TriviaPage)
      .then(() => {
        this.intro = true;
      });
  }

}
