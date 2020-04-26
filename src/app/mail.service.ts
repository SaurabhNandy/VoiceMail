import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  public api_url = 'https://vatsalpalan.pythonanywhere.com';
  public current_mail: any;
  public username = '';
  public password = '';
  public is_authenticated: boolean = false;
  constructor() {

  }
}
