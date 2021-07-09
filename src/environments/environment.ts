// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replace
export const PRODUCTION: boolean = false;
export const ENVIRONMENT: any = {
  api: {
    dev: {
      clientSecret: '$56j%Z76rtq20',
      clientId: '1',
      url: 'http://localhost:3000/api/v1'
    },
    prod: {
      clientSecret: '$56j%as210"46¡¿72',
      clientId: '2',
      url: 'http://168.197.49.19/api/v1'
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
