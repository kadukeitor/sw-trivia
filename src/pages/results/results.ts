import {Component, ViewChild, ElementRef} from '@angular/core';
import {Platform, NavController, NavParams, LoadingController, ActionSheetController} from 'ionic-angular';

import {SocialSharing} from '@ionic-native/social-sharing';

@Component({
  selector: 'page-results',
  templateUrl: 'results.html'
})
export class ResultsPage {

  results: any = {};

  score: number = 0;
  scoreLimit: number = 70;

  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("image") image: ElementRef;
  image64: any;

  constructor(public params: NavParams,
              public platform: Platform,
              public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public actionSheetCtrl: ActionSheetController,
              private socialSharing: SocialSharing) {

    let score = 0;

    this.results = params.get('results');
    this.results.forEach(result => {
      score += ((result.correct == true) ? 1 : 0)
    });

    this.score = Math.floor(((score / this.results.length) * 100));

  }

  ngAfterViewInit() {
    this.prepareShare();
  }

  share() {

    let message = "I've got " + this.score + " in Star Wars Trivia";
    let subject = "Star Wars Trivia";
    let url = "https://goo.gl/Ldxuls";
    let hashtags = ["starwarstrivia", "starwars"];

    if (this.platform.is('cordova')) {

      let loading = this.loadingCtrl.create({
        content: 'Loading',
        duration: 5000
      });
      loading.present();
      this.socialSharing.share(message, subject, this.image64, url)
        .then(() => {
          loading.dismiss();
        })
        .catch(() => {
          loading.dismiss();
        })

    } else {

      let actionSheet = this.actionSheetCtrl.create({
        title: 'Share your Results',
        buttons: [
          {
            text: 'Twitter',
            icon: 'logo-twitter',
            handler: () => {
              let urlString = 'https://www.twitter.com/intent/tweet?';
              urlString += 'text=' + encodeURIComponent(message);
              urlString += '&url=' + encodeURIComponent(url);
              urlString += '&hashtags=' + encodeURIComponent(hashtags.join(','));
              window.open(urlString, 'Twitter', 'toolbar=0,status=0,resizable=yes,width=500,height=600');
            }
          },
          // {
          //   text: 'Facebook',
          //   icon: 'logo-facebook',
          //   handler: () => {
          //     let urlString = 'https://www.facebook.com/dialog/feed?';
          //     urlString += 'caption=' + encodeURIComponent(message);
          //     urlString += '&link=' + encodeURIComponent(url);
          //     // urlString += '&picture=' + encodeURIComponent(this.image64);
          //     window.open(urlString, 'Facebook', 'toolbar=0,status=0,resizable=yes,width=500,height=600');
          //   }
          // }
          {
            text: 'Cancel',
            role: 'cancel',
            icon: 'close'
          }
        ]
      });
      actionSheet.present();

    }
  }

  prepareShare() {
    let canvas = this.canvas.nativeElement;
    canvas.width = 240;
    canvas.height = 240;
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.rect(0, 0, 240, 240);
    ctx.fillStyle = "black";
    ctx.fill();
    let image = this.image.nativeElement;
    image.onload = () => {
      if (this.score < this.scoreLimit) {
        ctx.drawImage(image, 120, 60, 240, 240);
        ctx.font = '10pt Arial';
        ctx.strokeStyle = '#ffda44';
        ctx.fillStyle = '#ffda44';
        ctx.lineJoin = 'round';
        ctx.fillText("\"I find your lack of", 10, 30);
        ctx.fillText("faith disturbing.\"", 30, 50);
        ctx.font = '40pt Arial';
        ctx.fillText(this.score, 50, 130);
        ctx.font = '8pt Arial';
        ctx.fillText("from 100", 55, 155);
      } else {
        ctx.drawImage(image, 110, 110, 120, 120);
        ctx.font = '10pt Arial';
        ctx.strokeStyle = '#ffda44';
        ctx.fillStyle = '#ffda44';
        ctx.lineJoin = 'round';
        ctx.fillText("\"Great , you will be", 10, 30);
        ctx.fillText("a Jedi Master soon!\"", 30, 50);
        ctx.font = '40pt Arial';
        ctx.fillText(this.score, 50, 130);
        ctx.font = '8pt Arial';
        ctx.fillText("from 100", 55, 155);
      }
      ctx.fillText("STAR WARS", 10, 200);
      ctx.fillText("TRIVIA", 25, 215);
      this.image64 = canvas.toDataURL();
    };


  }


}
