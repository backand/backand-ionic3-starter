import { Component } from '@angular/core';
import 'rxjs/Rx';
import { BackandService } from '@backand/angular2-sdk';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook';
import { LoadingController, AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'signup.html',
  selector: 'page-signup',
})
export class SignupPage {

  email: string = '';
  firstName: string = '';
  lastName: string = '';
  signUpPassword: string = '';
  confirmPassword: string = '';
  userData: any = {};
  loaderIns: any;

  constructor(
    private backand: BackandService,
    private googlePlus: GooglePlus,
    private fb: Facebook,
    private fbWeb: FacebookService,
    public loader: LoadingController,
    public Alert: AlertController) {

    //configure credentials for facebook  
    let initParams: InitParams = {
      appId: '1717659821597013',
      xfbml: true,
      version: 'v2.8'
    };
    fbWeb.init(initParams);
  }

  public signUp() {
    if (this.signUpPassword !== this.confirmPassword) {
      this.notify('Error', 'Passwords should match');
      return;
    }
    this.showLoader();
    this.backand.signup(this.firstName, this.lastName, this.email, this.signUpPassword, this.confirmPassword)
      .then((res: any) => {
        this.hideLoader();
        this.email = this.signUpPassword = this.confirmPassword = this.firstName = this.lastName = '';
        this.notify('Success', 'Sign up succeeded');
      },
      (err: any) => {
        this.hideLoader();
        this.notify('Error', `Error: ${err.data}`);
      }
      );
  }

  public socialWeb(provider: string): void {
    switch (provider) {
      case 'facebook':
        this.showLoader();
        this.fbWeb.login()
          .then((response: LoginResponse) => {
            console.log('Logged into Facebook!', response);
            this.hideLoader();
            if (response.status == 'connected') {
              this.userData = response;
              this.backand.socialSigninWithToken('facebook', response.authResponse.accessToken).then(
                (resBackand: any) => {
                  console.log('social', resBackand);
                },
                (errBackand: any) => {
                  console.log('err', errBackand);
                }
              );
            }
            else {
              this.notify('Error', 'Facebook Failed');
            }
          })
          .catch((error: any) => {
            console.log('Error logging into Facebook', error);
          });
        break;

      default:
        break;
    }

  }

  public inAppSocial(provider: string): void {
    console.log('inAppSocial', provider);
    if (provider == 'google') {
      this.googlePlus.login({
        'offline': true,
        // 'webClientId': '112994394693053649628'// '920024207242-hsvnlta6q7086c9on1ir1ggq5pud809v.apps.googleusercontent.com'// 'client id of the web app/server side'
        // 'clientSecret': 'AYdbZm1QfRv1urOaGNITtOzJ'
      })
        .then(
        (res) => {
          console.log('Logged into Google!', res);
          this.userData = res;
          this.backand.socialSigninWithToken('google', res.accessToken).then(
            (resBackand: any) => {
              console.log('social', resBackand);
            },
            (errBackand: any) => {
              console.log('err', errBackand);
            }
          );
        },
        (err) => {
          console.log('error', err);
          console.log(err);
        });
    }
    else if (provider == 'facebook') {
      this.fb.login(['public_profile', 'user_friends', 'email'])
        .then((res: FacebookLoginResponse) => {
          console.log('Logged into Facebook!', res);
          if (res.status == 'connected') {
            this.userData = res;
            this.backand.socialSigninWithToken('facebook', res.authResponse.accessToken).then(
              (resBackand: any) => {
                console.log('social', resBackand);
              },
              (errBackand: any) => {
                console.log('err', errBackand);
              }
            );
          }
          else {
            console.log('Facebook failed');
          }

        })
        .catch(e => {
          console.log('Error logging into Facebook', e);
        });
    }

  }





  /**
   * @name showLoader 
   * @description An helper function to show loading
   * @private
   * @memberof SignupPage
   */
  private showLoader() {
    this.loaderIns = this.loader.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loaderIns.present();
  }
  /**
   * @name hideLoader
   * @description An helper function to hide loading
   * @private
   * @memberof SignupPage
   */
  private hideLoader() {
    this.loaderIns.dismiss()
  }

  /**
   * @description 
   * @private
   * @param {string} title 
   * @param {string} message 
   * @memberof SignupPage
   */
  private notify(title: string, message: string) {
    this.Alert.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    }).present();
  }

}
