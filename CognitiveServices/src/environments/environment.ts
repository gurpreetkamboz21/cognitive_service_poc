// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
};

export const SPEECH_CONFIG = {
  API_KEY: "7745e44dea9e418688b594f6d425f24e",
  REGION: "eastus",
};

export const CUSTOMMODEL_CONFIG = {
  MODEL_ID: 'b335919b-35b6-4851-8a77-1919c7b8dc33'
};

export const domain = 'http://127.0.0.1:5000';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
