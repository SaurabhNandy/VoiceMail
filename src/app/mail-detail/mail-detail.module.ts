import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MailDetailPage } from './mail-detail.page';
import { RouterModule } from '@angular/router';
import { TextAvatarModule } from '../text-avatar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TextAvatarModule,
    RouterModule.forChild([{ path: '', component: MailDetailPage }])
  ],
  declarations: [MailDetailPage]
})
export class MailDetailPageModule {}
