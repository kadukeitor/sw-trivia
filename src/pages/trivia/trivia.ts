import {Component, ViewChild} from '@angular/core';
import {Nav, NavController, ViewController, Slides} from 'ionic-angular';

import {ResultsPage} from '../results/results';

import {SWAPI} from '../../providers/swapi';
import {Wikia} from '../../providers/wikia';

@Component({
  selector: 'page-trivia',
  templateUrl: 'trivia.html'
})
export class TriviaPage {

  @ViewChild(Slides) slides: Slides;

  private resources = [
    {id: 'people', title: 'Character'},
    {id: 'starships', title: 'Starship'},
    {id: 'vehicles', title: 'Vehicle'},
    {id: 'people', title: 'Character'},
    {id: 'species', title: 'Specie'},
    {id: 'planets', title: 'Planet'},
  ];

  image: any;
  selected: any = {};
  options: any = [];
  resource: any = {};

  answer: number = -1;

  progress: number = 0;
  timer: any;

  results: any = [];

  constructor(public nav: Nav,
              public navCtrl: NavController,
              public viewCtrl: ViewController,
              public wikia: Wikia,
              public swapi: SWAPI) {


    this.startTimer();
    this.prepareQuestion(null);

  }

  prepareQuestion(resourceId) {
    this.resource = {};
    this.selected = {};
    this.image = null;
    this.options = [];
    //
    if (!resourceId) {
      resourceId = this.generateRandom(0, this.resources.length - 1, []);
    }
    this.resource = this.resources[resourceId];
    let resource = this.swapi[this.resource.id];
    this.swapi.random(this.resource.id, (err, random) => {
      this.wikia.getThumbnail(random.name, (err, image) => {
        if (image) {
          this.selected = random;
          this.image = image;
          let options = [];
          let index_0 = random.index;
          options[0] = resource[index_0];
          let index_1 = this.generateRandom(0, resource.length - 1, [index_0]);
          options[1] = resource[index_1];
          let index_2 = this.generateRandom(0, resource.length - 1, [index_0, index_1]);
          options[2] = resource[index_2];
          let index_3 = this.generateRandom(0, resource.length - 1, [index_0, index_1, index_2]);
          options[3] = resource[index_3];
          this.options = this.shuffleArray(options);
        } else {
          this.prepareQuestion(resourceId);
        }
      });
    })
  }

  next() {
    this.results.push({
      correct: (this.selected.url == this.answer),
      answer: this.selected,
      options: this.options
    });
    if (this.results.length == 10) {
      clearInterval(this.timer);
      this.navCtrl
        .push(ResultsPage, {results: this.results})
        .then(() => {
          const index = this.viewCtrl.index;
          this.nav.remove(index);
        });
    } else {
      this.startTimer();
      this.slides.slideTo(0, 500);
      this.answer = -1;
      this.prepareQuestion(null);
    }
  }

  startTimer() {
    this.progress = 0;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.progress <= 100) {
        this.progress += 0.5;
      } else {
        this.answer = -1;
        this.next();
      }
    }, 50);
  }

  generateRandom(min, max, exclude) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    return (exclude.indexOf(num) > -1) ? this.generateRandom(min, max, exclude) : num;
  }

  shuffleArray(array) {
    return array.sort(function () {
      return .5 - Math.random();
    });
  }

  ionViewWillLeave() {
    clearInterval(this.timer);
  }

}
