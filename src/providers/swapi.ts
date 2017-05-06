import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import async from 'async';

import {Storage} from '@ionic/storage';

@Injectable()
export class SWAPI {

  api: string = 'http://swapi.co/api';
  prefix: string = 'swapi';

  people: any = [];
  films: any = [];
  starships: any = [];
  vehicles: any = [];
  species: any = [];
  planets: any = [];


  constructor(public http: Http,
              public storage: Storage) {
  }

  // All

  sync(done) {

    this.storage.ready()
      .then(() => {
        this.storage.get(this.prefix + "-cache-expiration").then((date) => {
          let currentDate = new Date();
          if (date < currentDate) {

            async.parallel([
              callback => {
                this.allPeople({}, callback)
              },
              callback => {
                this.allFilms({}, callback)
              },
              callback => {
                this.allStarShips({}, callback)
              },
              callback => {
                this.allVehicles({}, callback)
              },
              callback => {
                this.allSpecies({}, callback)
              },
              callback => {
                this.allPlanets({}, callback)
              },
            ], (err) => {
              this.storage.set(this.prefix + "-cache-people", this.people);
              this.storage.set(this.prefix + "-cache-films", this.films);
              this.storage.set(this.prefix + "-cache-starships", this.starships);
              this.storage.set(this.prefix + "-cache-vehicles", this.vehicles);
              this.storage.set(this.prefix + "-cache-species", this.species);
              this.storage.set(this.prefix + "-cache-planets", this.planets);
              let date = new Date();
              let cacheExpiration = date.setDate(date.getDate() + 1);
              this.storage.set(this.prefix + "-cache-expiration", cacheExpiration);
              done(err);
            });

          } else {

            async.parallel([
              callback => {
                this.storage.get(this.prefix + "-cache-people")
                  .then(people => {
                    this.people = people;
                    callback(null, this.people);
                  })
              },
              callback => {
                this.storage.get(this.prefix + "-cache-films")
                  .then(films => {
                    this.films = films;
                    callback(null, this.films);
                  })
              },
              callback => {
                this.storage.get(this.prefix + "-cache-starships")
                  .then(starships => {
                    this.starships = starships;
                    callback(null, this.starships);
                  })
              },
              callback => {
                this.storage.get(this.prefix + "-cache-vehicles")
                  .then(vehicles => {
                    this.vehicles = vehicles;
                    callback(null, this.vehicles);
                  })
              },
              callback => {
                this.storage.get(this.prefix + "-cache-species")
                  .then(species => {
                    this.species = species;
                    callback(null, this.species);
                  })
              },
              callback => {
                this.storage.get(this.prefix + "-cache-planets")
                  .then(planets => {
                    this.planets = planets;
                    callback(null, this.planets);
                  })
              },
            ], (err) => {
              done(err);
            });

          }
        })
      });
  }

  random(resource, done) {
    switch (resource) {
      case 'people':
        this.randomPeople(done);
        break;
      case 'starships':
        this.randomStarShips(done);
        break;
      case 'vehicles':
        this.randomVehicle(done);
        break;
      case 'species':
        this.randomSpecie(done);
        break;
      case 'planets':
        this.randomPlanet(done);
        break;
      default:
        this.randomPeople(done);
        break;
    }
  }

  // People

  allPeople(query, done) {
    this.findPeople(query)
      .subscribe(response => {
        this.people = this.people.concat(response.results);
        if (response.next) {
          query.page = query.page ? ( query.page + 1) : 1;
          this.allPeople(query, done);
        } else {
          done(null, this.people);
        }
      });
  }

  findPeople(query) {
    return this.http.get(this.api + '/people/', {params: query})
      .map((res: Response) => res.json())
  }

  randomPeople(done) {
    let total = this.people.length;
    let selected = Math.floor(Math.random() * total);
    let character = Object.assign({}, this.people[selected]);
    // index
    character.index = selected;
    // films
    character.films = character.films.map(filmUrl => {
      return this.films.find(film => {
        return film.url == filmUrl;
      })
    });
    // starships
    character.starships = character.starships.map(starshipUrl => {
      return this.starships.find(starship => {
        return starship.url == starshipUrl;
      })
    });
    // vehicles
    character.vehicles = character.vehicles.map(vehicleUrl => {
      return this.vehicles.find(vehicle => {
        return vehicle.url == vehicleUrl;
      })
    });
    // species
    character.species = character.species.map(specieUrl => {
      return this.species.find(specie => {
        return specie.url == specieUrl;
      })
    });
    // planets
    character.homeworld = this.planets.find(planet => {
      return planet.url == character.homeworld;
    });

    return done(null, character);
  }

  // Films

  allFilms(query, done) {
    this.findFilm(query)
      .subscribe(response => {
        this.films = this.films.concat(response.results);
        if (response.next) {
          query.page = query.page ? ( query.page + 1) : 1;
          this.allFilms(query, done);
        } else {
          done(null, this.films)
        }
      });
  }

  findFilm(query) {
    return this.http.get(this.api + '/films/', {params: query})
      .map((res: Response) => res.json())
  }

  // StarShips

  allStarShips(query, done) {
    this.findStarShips(query)
      .subscribe(response => {
        this.starships = this.starships.concat(response.results);
        if (response.next) {
          query.page = query.page ? ( query.page + 1) : 1;
          this.allStarShips(query, done);
        } else {
          done(null, this.starships);
        }
      });
  }

  findStarShips(query) {
    return this.http.get(this.api + '/starships/', {params: query})
      .map((res: Response) => res.json())
  }

  randomStarShips(done) {
    let total = this.starships.length;
    let selected = Math.floor(Math.random() * total);
    let starship = Object.assign({}, this.starships[selected]);
    // index
    starship.index = selected;
    // films
    starship.films = starship.films.map(filmUrl => {
      return this.films.find(film => {
        return film.url == filmUrl;
      })
    });
    // vehicles
    starship.pilots = starship.pilots.map(pilotUrl => {
      return this.people.find(pilot => {
        return pilot.url == pilotUrl;
      })
    });

    return done(null, starship);
  }

  // Vehicles

  allVehicles(query, done) {
    this.findVehicles(query)
      .subscribe(response => {
        this.vehicles = this.vehicles.concat(response.results);
        if (response.next) {
          query.page = query.page ? ( query.page + 1) : 1;
          this.allVehicles(query, done);
        } else {
          done(null, this.vehicles);
        }
      });
  }

  findVehicles(query) {
    return this.http.get(this.api + '/vehicles/', {params: query})
      .map((res: Response) => res.json())
  }

  randomVehicle(done) {
    let total = this.vehicles.length;
    let selected = Math.floor(Math.random() * total);
    let vehicle = Object.assign({}, this.vehicles[selected]);
    // index
    vehicle.index = selected;
    // films
    vehicle.films = vehicle.films.map(filmUrl => {
      return this.films.find(film => {
        return film.url == filmUrl;
      })
    });
    // pilots
    vehicle.pilots = vehicle.pilots.map(pilotUrl => {
      return this.people.find(pilot => {
        return pilot.url == pilotUrl;
      })
    });

    return done(null, vehicle);
  }

  // Species

  allSpecies(query, done) {
    this.findSpecies(query)
      .subscribe(response => {
        this.species = this.species.concat(response.results);
        if (response.next) {
          query.page = query.page ? ( query.page + 1) : 1;
          this.allSpecies(query, done);
        } else {
          done(null, this.species);
        }
      });
  }

  findSpecies(query) {
    return this.http.get(this.api + '/species/', {params: query})
      .map((res: Response) => res.json())
  }

  randomSpecie(done) {
    let total = this.species.length;
    let selected = Math.floor(Math.random() * total);
    let specie = Object.assign({}, this.species[selected]);
    // index
    specie.index = selected;
    // films
    specie.films = specie.films.map(filmUrl => {
      return this.films.find(film => {
        return film.url == filmUrl;
      })
    });
    // homeworld
    specie.homeworld = this.planets.find(planet => {
      return planet.url == specie.homeworld;
    });
    // people
    specie.people = specie.people.map(peopleUrl => {
      return this.people.find(people => {
        return people.url == peopleUrl;
      })
    });

    return done(null, specie);
  }

  // Planets

  allPlanets(query, done) {
    this.findPlanets(query)
      .subscribe(response => {
        this.planets = this.planets.concat(response.results);
        if (response.next) {
          query.page = query.page ? ( query.page + 1) : 1;
          this.allPlanets(query, done);
        } else {
          done(null, this.planets);
        }
      });
  }

  findPlanets(query) {
    return this.http.get(this.api + '/planets/', {params: query})
      .map((res: Response) => res.json())
  }

  randomPlanet(done) {
    let total = this.planets.length;
    let selected = Math.floor(Math.random() * total);
    let planet = Object.assign({}, this.planets[selected]);
    // index
    planet.index = selected;
    // films
    planet.films = planet.films.map(filmUrl => {
      return this.films.find(film => {
        return film.url == filmUrl;
      })
    });
    // people
    planet.residents = planet.residents.map(peopleUrl => {
      return this.people.find(people => {
        return people.url == peopleUrl;
      })
    });

    return done(null, planet);
  }

}
