// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.



export const environment = {
    production: false,
    deviceIconUrl:'https://webdev.mitoconnect.com',
    baseUrl: 'https://appdev.mitoconnect.com/api',
    wsUrl: 'wss://appdev.mitoconnect.com/websocket-connection/websocket/',
    vicsUrl:'wss://appdev.mitoconnect.com/gs-guide-websocket/websocket/',
    baseUrl2: 'https://appdev2.mitoconnect.com/RSBService/RSBService.svc',
    systemLogUrl: 'https://logdev.mitoconnect.com/rsbapp/_search',
    //   deviceIconUrl:'https://webqa.mitoconnect.com',
    // baseUrl2:'https://appqa2.mitoconnect.com/RSBService/RSBService.svc',
    // vicsUrl:'wss://appqa.mitoconnect.com/gs-guide-websocket/websocket/',
    // baseUrl : 'https://appqa.mitoconnect.com/api',
    // wsUrl: 'wss://appqa.mitoconnect.com/websocket-connection/websocket/',
};
