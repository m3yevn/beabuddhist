import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  constructor(private modal:ModalController) { }

  ngOnInit() {
  }

  back(){
    this.modal.dismiss({
      'dismissed': true
    });
  }
}
