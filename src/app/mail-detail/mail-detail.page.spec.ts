import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MailDetailPage } from './mail-detail.page';

describe('MailDetailPage', () => {
  let component: MailDetailPage;
  let fixture: ComponentFixture<MailDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MailDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
