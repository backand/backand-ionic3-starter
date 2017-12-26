import { Component } from '@angular/core';
import 'rxjs/Rx';
import { LoadingController, AlertController } from 'ionic-angular';
import { BackandService } from '@backand/angular2-sdk';

@Component({
  templateUrl: 'login.html',
  selector: 'page-login',
})
export class LoginPage {
  loaderIns: any;
  username: string = 'ionic2@backand.io';
  password: string = '123456';
  auth_type: string = "N/A";
  is_auth_error: boolean = false;
  auth_message: string = null;
  loggedInUser: string = '';

  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  constructor(private backand: BackandService, public loader: LoadingController, public Alert: AlertController) {

    this.backand.user.getUserDetails().then(
      (res: any) => {
        if (res.data) {
          this.loggedInUser = res.data.username;
          this.auth_message = 'OK';
          this.auth_type = res.data.token_type == 'Anonymous' ? 'Anonymous' : 'Token';
        }
      },
      (err: any) => {
        this.loggedInUser = null;
        this.auth_message = null;
        this.auth_type = null;
      }
    );
  }

  ionViewDidLoad() {

  }
  public getAuthTokenSimple() {
    this.showLoader();
    this.auth_type = 'Token';
    this.backand.signin(this.username, this.password)
      .then((res: any) => {
        this.auth_message = 'OK';
        this.is_auth_error = false;
        this.loggedInUser = res.data.username;
        this.username = '';
        this.password = '';
        this.hideLoader();
      },
      (error: any) => {
        let errorMessage: string = error.data.error_description;
        this.is_auth_error = true;
        this.hideLoader();
        this.notify('Error', `Error: ${errorMessage}`);
      }
      );
  }

  public useAnonymousAuth() {
    this.showLoader();
    this.backand.useAnonymousAuth()
      .then((res: any) => {
        this.auth_message = 'OK';
        this.is_auth_error = false;
        this.loggedInUser = res.data.username;
        this.hideLoader();
      },
      (error: any) => {
        let errorMessage: string = error.data.error_description || error.data;
        this.notify('Error', `Error: ${errorMessage}`);
        this.is_auth_error = true;
        this.hideLoader();
      });
  }

  public socialSignin(provider: string) {
    this.showLoader();
    this.backand.socialSignin(provider)
      .then((res: any) => {
        this.auth_message = 'OK';
        this.is_auth_error = false;
        this.loggedInUser = res.data.username;
        this.hideLoader();
      },
      (error: any) => {
        let errorMessage: string = error.data.error_description;
        this.notify('Error', `Error: ${errorMessage}`);
        this.is_auth_error = true;
        this.hideLoader();
      }
      );
  }

  public signOut() {
    this.auth_message = null;
    this.backand.signout();
  }


  public changePassword() {
    if (this.newPassword != this.confirmNewPassword) {
      this.notify('Error', 'Passwords should match');
      return;
    }
    this.showLoader();

    this.backand.changePassword(this.oldPassword, this.newPassword)
      .then((res: any) => {
        this.oldPassword = this.newPassword = this.confirmNewPassword = '';
        this.hideLoader();
        this.notify('Success', 'Password changed');
      },
      (err: any) => {
        let errorMessage: string = err.data.error_description || err.data;
        this.notify('Error', `Error: ${errorMessage}`);
        this.hideLoader();
      }
      );
  }
  /**
   * @name showLoader 
   * @description An helper function to show loading
   * @private
   * @memberof LoginPage
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
   * @memberof LoginPage
   */
  private hideLoader() {
    this.loaderIns.dismiss()
  }

  /**
   * @description 
   * @private
   * @param {string} title 
   * @param {string} message 
   * @memberof LoginPage
   */
  private notify(title: string, message: string) {
    this.Alert.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    }).present();
  }

}
