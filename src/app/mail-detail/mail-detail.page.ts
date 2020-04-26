import { Component, NgZone } from '@angular/core';
import { MailService} from '../mail.service';
import { Platform } from '@ionic/angular';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mail-detail',
  templateUrl: './mail-detail.page.html',
  styleUrls: ['./mail-detail.page.scss'],
})
export class MailDetailPage{

  mail: any;
  constructor(public mailservice: MailService, private tts: TextToSpeech, private platform: Platform, private zone: NgZone, private router: Router) { 
    this.mail = mailservice.current_mail;
    console.log(this.mail);
  }

  ngAfterViewInit(){
    this.platform.ready().then(() => {
      this.speak("Swipe right or press the back button to go back",()=>{
        this.speak("Mail from "+this.mail.from+"... Received at "+this.mail.date,()=>{
          if(this.mail.subject=="None"){
            var sub = "Mail has no Subject";
          }
          else{
            var sub = "Subject: "+ this.mail.subject;
          }
          this.speak(sub,()=>{
            if(this.mail.body.length>0){
              this.speak("Body: "+this.stripHtml(this.mail.body),()=>{
                this.speak("Swipe right or press the back button to go back",()=>{});
              });
            }
            else{
              this.speak("Mail has no body.",()=>{
                this.speak("Swipe right or press the back button to go back",()=>{});
              });
            }
          });
        });
      });
    });
  }

  ionViewDidLeave(){
    this.speak(" ",{});
  }

  changeTab(e: any){
    if(e.direction == 4){
      this.zone.run(async () => {
        this.router.navigateByUrl('/tabs/tab2');
      });
    }
  }

  stripHtml(html){
    var temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }

  speak(data, callback) {
    this.tts.speak({
      text: data,
      locale : "en-EN",
      rate: 0.90
    }).then(() => {
      callback();
    }).catch((reason: any) => console.log(reason));
  }
}
