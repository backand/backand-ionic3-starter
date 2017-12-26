# Backand Ionic 3 + Ng5 Example application
Create a mobile application with ionic and backand.

# Prerequisites 
1. Install latest nodeJs https://nodejs.org/

2. Install Ionic. [ionic](https://ionicframework.com/getting-started/).
```bash
npm install -g cordova ionic
```

# Getting started
1. clone repo https://github.com/backand/backand-ionic3-starter.git

2. cd `backand-ionic3-starter`

3. Configure backand credentials in `app.module.ts`

 ```javascript
 this.backand.init({
      appName: 'your app name', 
      signUpToken: 'your signup token', 
      anonymousToken: 'your anonymous token', 
      runSocket: true
      mobilePlatform: 'ionic'
    });
 ```  

4. Launch application in browser
 ```bash
  ionic serve
 ```




 # Backand Integration with existing project or new Project.
 Please follow below steps to start backand integration in your ongoing projects.

1. Install dependencies
```bash
npm i -S @backand/angular2-sdk socket.io-client @types/node @types/socket.io-client ionic-native
```

2. Install Cordova Plugins(Optional - you may have already installed)
```bash
ionic cordova plugin add cordova-plugin-inappbrowser
```

3. Add plateforms (Android/iOS) - Optional:
```bash
ionic cordova platform add <platform>
ionic cordova run <platform>
```

4. Setting up your own Backand application -
    - Create a free personal application at backand.com
    - Configure backand credentials in `app.module.ts`
      ```javascript
      this.backand.init({
            appName: 'your app name', 
            signUpToken: 'your signup token', 
            anonymousToken: 'your anonymous token', 
            runSocket: true
            mobilePlatform: 'ionic'
          });
      ```  

## how to setup Social Login in App and Web

In App social login is intended to use the native social SDK of Faceboook or Google. For Google this is due to recent restrictions in Google that prevent using the Signup with Google through web views.

In the `signup` screen we label this functionality as In App Social

### Google
[Install Ionic Native Google Plus plugin](https://ionicframework.com/docs/native/google-plus/)

### Facebook
[Install Ionic Native Facebook plugin](https://ionicframework.com/docs/native/facebook/)

### Ionic Web App for Facebook Sharing
When an Ionic web app is shared in Facebook feed, the usual Backand social signup with Facebook will not work.

1. Detect this case in your code with:
  ```javascript
  function isFacebookApp() {
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
  }
  ```

2. Install ngx-facebook:
```bash
npm install ngx-facebook --save
```
3. Use the code labeled `Social Web` in signup screen.
