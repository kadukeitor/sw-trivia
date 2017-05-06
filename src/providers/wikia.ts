import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Platform} from 'ionic-angular';
import 'rxjs/add/operator/map';

import {Storage} from '@ionic/storage';

@Injectable()
export class Wikia {

  private api: string = 'http://starwars.wikia.com/api/v1/';
  private prefix: string = 'wikia';

  constructor(public platform: Platform,
              public http: Http,
              public storage: Storage) {

    if (!platform.is('cordova')) {
      this.api = 'https://cors.kpots.com/http://starwars.wikia.com/api/v1/';
    }

  }

  getThumbnail(title, done) {
    let key = btoa(title);
    this.storage.get(this.prefix + "-thumbnail-" + key).then((thumbnail) => {
      let currentDate = new Date();
      if (thumbnail && thumbnail.exp > currentDate) {
        done(null, thumbnail.url);
      } else {
        this.http.get(this.api + 'Articles/Details', {
          params: {
            ids: 50,
            titles: title,
            abstract: 100,
            width: 160,
            height: 160
          }
        }).map((res: Response) => res.json())
          .subscribe(response => {
            let id = Object.keys(response.items)[0];
            let item = response.items[id];
            if (item && item.thumbnail) {
              let date = new Date();
              let cacheExpiration = date.setDate(date.getDate() + 1);
              this.storage.set(this.prefix + "-thumbnail-" + key, {url: item.thumbnail, exp: cacheExpiration});
              done(null, item.thumbnail);
            }
            // else if (item && (item.abstract.indexOf('REDIRECT') > -1 || item.abstract.indexOf('redirect') > -1)) {
            //   let newTitle = item.abstract.replace('REDIRECT ', '');
            //   newTitle = newTitle.replace('redirect ', '');
            //   setTimeout(() => {
            //     this.getThumbnail(newTitle, done);
            //   }, 1000);
            // }
            else {
              done(null, null);
            }
          })
      }
    });
  }

}
