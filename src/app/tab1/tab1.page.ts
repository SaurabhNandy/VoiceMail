import { Component, NgZone } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { Platform } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { MailService} from '../mail.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

  match = '';
  username = '';
  password = '';
  is_authenticated: boolean = false;
  isRecording = false;
  count: number = 0;
  is_composed: boolean;
  to = '';
  subject = '';
  body = '';
 
  constructor(public mailservice: MailService, private zone: NgZone, private router: Router, private speechRecognition: SpeechRecognition, private tts: TextToSpeech, private platform:Platform, private cd: ChangeDetectorRef, private nativeStorage: NativeStorage, private http: HTTP) { 
    this.nativeStorage.getItem('user_data')
    .then(data => {
        this.username = data.username;
        this.password = data.password;
        this.is_authenticated = data.is_authenticated;
      }, error => {
        console.error("error "+error);
        this.zone.run(async () => {
          this.router.navigateByUrl('/login'); //uncomment this too
        });
      });
  }

  ngAfterViewInit(){
    this.platform.ready().then(() => {
      this.speak("Double tap to start composing a mail",()=>{
        this.speak("Swipe left to view inbox",()=>{
          this.speak("Swipe down to refreash",()=>{
          this.is_composed = false;
          });
        });
      }); 
    });
  }

  doRefresh(event) {
    setTimeout(() => {
      this.to = '';
      this.subject = '';
      this.body = '';
      this.is_composed = false;
      this.speak("Double tap to start composing a mail again",()=>{});
      event.target.complete();
    }, 1000);
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
      language: 'en-US'
    }
    this.speechRecognition.startListening(options).subscribe((matches: Array<string>)=> {
      this.zone.run(() => {
        this.match = matches[0];
        this.cd.detectChanges();
        callback();
      });
    });
    this.isRecording = true;
  }

  composeMail(){
    this.speak("Whom do you want to send the email to? please say the email i.d. of the receiver...",()=>{
      this.startListening(()=>{
        this.to = this.match.toLocaleLowerCase().replace(/\s/g,'');
        this.speak("What is the subject of the mail?",()=>{
          this.startListening(()=>{
            this.subject = this.match;
            this.speak("What is the body of the mail?",()=>{
              this.startListening(()=>{
                this.body = this.match;
                this.speak("Double tap to send the mail...",()=>{
                  this.is_composed = true;
                });
              });
            });
          });
        });
      });
    });
  }

  sendMail(){
    this.speak("Sending mail... please wait", ()=>{
      this.http.setDataSerializer('json');
      this.http.post(this.mailservice.api_url+'/mail-server/send', 
          {
            "sender_email": this.username, 
            "password": this.password, 
            "receiver_email": this.to,
            "subject": this.subject,
            "body": {
              "type": "plain",
              "content": this.body
            }
          },
          {'Content-Type': 'application/json'})
          .then(data => {
            this.speak(data.data,()=>{});
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
        if(this.is_composed){
          this.sendMail();
        }
        else{
          this.composeMail();
        }
      }
    }, 251);
  }

  changeTab(e){
    //left direction
    if(e.direction == 2){
      this.zone.run(async () => {
        this.router.navigateByUrl('/tabs/tab2');
      });
    }
  }

  speak(data, callback) {
    this.tts.speak({
      text: data,
      locale : "en-EN",
      rate: 0.80
    }).then(() => {
      callback();
    }).catch((reason: any) => console.log(reason));
  }
}
