import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  constructor(private modal: ModalController) { }

  ngOnInit() {
  }

  async back() {
    this.modal.dismiss({
      'dismissed': true
    });
  }
  
  async save() {
    this.modal.dismiss({
      'dismissed': true
    });
  }
}
