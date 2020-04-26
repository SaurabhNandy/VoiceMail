import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { MailService} from '../mail.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage{

  auth_button: boolean = false;
  username = '';
  password = '';
  is_authenticated: boolean = false;
  count = 0;
  match = '';
  isRecording = false;
  canSigninIn = true;
  constructor(public mailservice: MailService, private tts: TextToSpeech, private router: Router, private zone: NgZone, private speechRecognition: SpeechRecognition, private platform: Platform, private cd: ChangeDetectorRef, private http: HTTP, private nativeStorage: NativeStorage) { 
    this.nativeStorage.getItem('user_data')
    .then(data => {
        this.username = data.username;
        this.password = data.password;
        this.is_authenticated = data.is_authenticated;
      },
      error => {
        console.error("error"+error);
      }
    );
    this.auth_button = this.is_authenticated;
  }

  ngAfterViewInit(){
    this.platform.ready().then(() => {
      this.speak("Welcome  to voicemail",()=>{
        if(!this.is_authenticated){
          this.speak("Please Sign in to continue..",()=>{
            this.speak("Double tap to start the sign in process",()=>{
              this.speak("Swipe down to refresh",()=>{
                this.canSigninIn = false; //change to false afterwards
              });
            });
          });
        }
        else{
          this.speak("Redirecting to Home page",()=>{
            this.zone.run(async () => {
              this.router.navigateByUrl('/tabs');
            }); 
          });
        }
      });
    });
  }

  doRefresh(event) {
    setTimeout(() => {
      if(!this.is_authenticated){
        this.username = '';
        this.password = '';
        this.canSigninIn = false;
        this.speak("Double tap to start the sign in process again",()=>{});
      }
      event.target.complete();
    }, 1000);
  }

  setStorage(u, p){
    this.nativeStorage.setItem("user_data", {username: u, password: p, is_authenticated: true});
  }
  
  isIos() {
    return this.platform.is('ios');
  }
 
  stopListening() {
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
    });
  }
 
  getPermission() {
    this.speechRecognition.hasPermission()
    .then((hasPermission: boolean) => {
      if (!hasPermission) {
        this.speechRecognition.requestPermission();
      }
    });
  }
 
  startListening(callback) {
    let options = {
      language: 'en-EN',
    }
    this.getPermission();
    this.speechRecognition.startListening(options).subscribe((matches: Array<string>)=> {
      this.zone.run(() => {
        this.match = matches[0];
        this.cd.detectChanges();
        callback();
      });
    }, (onerror) => console.log('error:', onerror));
    this.isRecording = false;
  }
  
  authoriseUser(){
    this.speak("Say your email i.d. please",()=>{
      this.startListening(()=>{
        this.username = this.match.toLocaleLowerCase().replace(/\s/g,'');
        this.speak("Say your password",()=>{
          this.startListening(()=>{
            this.password = this.match.replace(/\s/g,'');
            if(this.username.length>0 && this.password.length>0){
              this.speak("Double tap to verify user", ()=>{
                this.canSigninIn = true;
              });
            }
          });
        });
      });  
    });  
  }
  
  tapEvent(){
    this.count++;
    setTimeout(() => {
      if (this.count == 1) {
        this.count = 0;
      }
      if(this.count == 2){
        this.count = 0;
        console.log('Double Tap');
        if(this.canSigninIn){
          this.http.setDataSerializer('json');
          this.http.post(this.mailservice.api_url+'/mail-server/authenticate', 
          {"sender_email": this.username, "password": this.password},
          {'Content-Type': 'application/json'})
          .then(data => {
            if(data.data=="Accepted"){
              this.setStorage(this.username, this.password);
              this.speak("Verification successful",()=>{
                this.zone.run(async () => {
                  this.router.navigateByUrl('/tabs');
                });
              });
            }
            else if(data.data=="Incorrect Username or Password"){
              this.speak("Incorrect Username or Password. Please try again",()=>{
                this.speak("Double tap to start the sign in process again",()=>{
                  this.canSigninIn = false;
                });
              });
            }
          })
          .catch(error => {
            console.log(error);
            this.speak("An error occurred. Please try again",()=>{
              this.speak("Double tap to start the sign in process again",()=>{
                this.canSigninIn = false;
              });
            });
          });
        }
        else{
          this.authoriseUser(); // uncomment this too
        }
      }
    }, 251);
  }

  speak(data, callback) {
    this.tts.speak({
      text: data,
      locale : "en-EN",
      rate: 0.85
    }).then(() => {
      callback();
    }).catch((reason: any) => console.log(reason));
  }
}
