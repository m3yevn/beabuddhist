// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "**Replace_With_Your_Own_Firebase_API**",
    authDomain: "beabuddhist-3ceda.firebaseapp.com",
    databaseURL: "https://beabuddhist-3ceda.firebaseio.com",
    projectId: "beabuddhist-3ceda",
    storageBucket: "eabuddhist-3ceda.appspot.com",
    messagingSenderId: "840588484607"
  },
  country:{
    apiUrl: "https://restcountries.eu/rest/v2/"
  }
 };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
