import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { MailService} from '../mail.service';


@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})


export class Tab2Page{

  username = '';
  password = '';
  is_authenticated: boolean = false;
  received_mails = [];
  next_mail_id = null;
  active_mail = {"index": parseInt('-1'), "id": ""};
  count = 0;
  
  constructor(public mailservice: MailService, private router: Router, private platform: Platform, private zone: NgZone, private tts: TextToSpeech, private nativeStorage: NativeStorage, private http: HTTP) {
    this.nativeStorage.getItem('user_data')
    .then(data => {
        this.username = data.username;
        this.password = data.password;
        this.is_authenticated = data.is_authenticated;
      },
      error =>{console.error("error"+error);
      this.zone.run(async () => {
        this.router.navigateByUrl('/login'); //uncomment this too
      });
    });
  }

  ngAfterViewInit(){
    this.platform.ready().then(() => {
      this.speak("Please wait while we fetch your mails",()=>{
        this.speak("Swipe right to start composing a mail",()=>{
          this.fetchMail(()=>{
            this.speak("Mails loaded successfully. Tap once to select a mail and double tap to view its details",()=>{ });
          });
        });
      }); 
    });
  }

  ionViewDidLeave(){
    this.speak(" ",{});
  }

  fetchMail(callback){
    if(this.next_mail_id==0){
      console.log('');
      this.speak('no more mails to fetch. End of list reached.',()=>{});
    }
    else{
      this.http.setDataSerializer('json');
      this.http.post(this.mailservice.api_url+'/mail-server/receive', 
      {"sender_email": this.username, "password": this.password, 
      "label": "inbox", "next_mail_id": this.next_mail_id, "count": 10},
      {'Content-Type': 'application/json'})
      .then(data => {
        var response = JSON.parse(data.data);
        if(response["status"]=="Accepted"){
          this.next_mail_id = response["next_mail_id"];
          response["result"].forEach(mail=>{
            this.zone.run(() => {
              var sub = mail['Subject'];
              if(sub.toLocaleUpperCase().slice(0,8)=='=?UTF-8?'){
                sub = 'None';
              }
              this.received_mails.push({
                'id': mail['id'],
                'from': mail['From'],
                'from-emailid': mail['From_id'],
                'to': mail['To'],
                'date': mail['Date'].slice(0,25),
                'subject': sub,
                'snippet': this.stripHtml(mail['Content']),
                'body': mail['Content'],
                'attachments': mail['Attachments']
              });
            });
          });
          callback();
        }
      }).catch(error => {
        console.log(error);
      });
    }
  }

  doInfinite(event) {
    setTimeout(() => {
      this.speak("Loading more mails... please wait",()=>{
        this.fetchMail(()=>{
          this.speak("Loaded more mails...",()=>{});
          event.target.complete();
        });  
      });
    }, 5); 
  }

  changeTab(e){
    if(e.direction == 4){
      this.zone.run(async () => {
        this.router.navigateByUrl('/tabs/tab1');
      });
    }
  }

  changeActive(index, id){
    if(this.active_mail.id!=id){
      this.active_mail = {"index": index, "id": id};
      var mail = this.received_mails[index];
      var value = "Mail from "+mail.from+". Subject : "+mail.subject+". ";
      this.speak(value,()=>{});
    }
    
  }

  stripHtml(html){
    var temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    var snip = temporalDivElement.textContent || temporalDivElement.innerText || "";
    return snip.split(".")[0].slice(0,100);
  }

  tapEvent(){
    this.count++;
    setTimeout(() => {
      if (this.count == 1) {
        this.count = 0;
      }
      if(this.count == 2){
        this.count = 0;
        this.mailservice.current_mail = this.received_mails[this.active_mail["index"]];
        this.zone.run(async () => {
          this.router.navigateByUrl('/tabs/receive/details');
        });
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


