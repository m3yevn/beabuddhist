import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  countryUrl: string = environment.country.apiUrl;

  constructor(private http:HttpClient) { }

  getAllCountries() {
    return new Promise<any>( (resolve,reject) => {
      this.http.get(this.countryUrl+'all').subscribe( data => {
        resolve(data);
      },
      error => {
        reject(error);
      })
    })
  }
  getCountry(name) {
    return new Promise<any>( (resolve,reject) => {
      this.http.get(this.countryUrl+'name'+'/'+name).subscribe( data => {
        resolve(data[0]);
      },
      error => {
        reject(error);
      })
    })
  }
}
