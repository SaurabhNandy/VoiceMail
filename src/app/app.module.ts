import { NgModule } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import { MailService} from './mail.service';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextAvatarModule } from './text-avatar/text-avatar.module';


export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
    'pinch': { enable: false },
    'rotate': { enable: false }
  }
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    MailService,
    TextToSpeech, SpeechRecognition, TextAvatarModule, HTTP, NativeStorage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

