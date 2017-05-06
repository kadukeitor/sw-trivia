import {Component, ViewChild, NgZone} from '@angular/core';
import {NavController, ViewController, Slides} from 'ionic-angular';

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

  resource: any = {};
  selected: any = {};
  image: any;
  options: any = [];

  answer: number = -1;
  questions: number = 10;

  progress: number = 0;
  timer: any;

  results: any = [];

  constructor(public zone: NgZone,
              public navCtrl: NavController,
              public viewCtrl: ViewController,
              public wikia: Wikia,
              public swapi: SWAPI) {

    this.prepareQuestion(null, () => {
      this.startTimer();
    });

  }

  prepareQuestion(resourceIndex, done) {

    this.resource = {};
    this.selected = {};
    this.image = null;
    this.options = [];

    // Little Delay
    setTimeout(() => {

      //
      if (!resourceIndex) {
        resourceIndex = this.generateRandom(0, this.resources.length - 1, []);
      }
      let resourceId = this.resources[resourceIndex].id;
      let resource = this.swapi[resourceId];
      this.swapi.random(resourceId, (err, random) => {
        this.wikia.getThumbnail(random.name, (err, image) => {
          if (image) {
            let options = [];
            let index_0 = random.index;
            options[0] = resource[index_0];
            let index_1 = this.generateRandom(0, resource.length - 1, [index_0]);
            options[1] = resource[index_1];
            let index_2 = this.generateRandom(0, resource.length - 1, [index_0, index_1]);
            options[2] = resource[index_2];
            let index_3 = this.generateRandom(0, resource.length - 1, [index_0, index_1, index_2]);
            options[3] = resource[index_3];
            //
            this.zone.run(() => {
              this.resource = this.resources[resourceIndex];
              this.selected = random;
              this.image = image;
              this.options = this.shuffleArray(options);
              // Log
              // console.log(this.results.length);
              // console.log(this.resource);
              // console.log(this.selected);
              // console.log(this.image);
              // console.log(this.options);
              // console.log('===');
              done(true);
            });
          } else {
            this.prepareQuestion(resourceIndex, done);
          }
        });
      })

    }, 500);

  }

  next() {
    this.results.push({
      correct: (this.selected.url == this.answer),
      answer: this.selected,
      options: this.options
    });
    if (this.results.length >= this.questions) {
      clearInterval(this.timer);
      this.navCtrl
        .push(ResultsPage, {results: this.results})
        .then(() => {
          const index = this.viewCtrl.index;
          this.navCtrl.remove(index);
        });
    } else {
      this.stopTimer();
      this.slides.slideTo(0, 500);
      this.answer = -1;
      this.prepareQuestion(null, () => {
        this.startTimer();
      });
    }
  }

  startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => {
      if (this.progress <= 100) {
        this.progress += 1;
      } else {
        this.answer = -1;
        this.next();
      }
    }, 100);
  }

  stopTimer() {
    this.progress = 0;
    clearInterval(this.timer);
  }

  generateRandom(min, max, exclude) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    return (exclude.indexOf(num) > -1) ? this.generateRandom(min, max, exclude) : num;
  }

  shuffleArray(array) {
    return array.sort(() => {
      return .5 - Math.random();
    });
  }

  ionViewWillLeave() {
    this.stopTimer();
  }

}
