import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {

  constructor(private modal:ModalController) { }

  ngOnInit() {
  }


  back(){
    this.modal.dismiss({
      'dismissed': true
    });
  }
}
