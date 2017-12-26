#Backand Ionic 3 + Ng5 Example application
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