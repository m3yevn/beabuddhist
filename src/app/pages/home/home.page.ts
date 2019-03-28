import { ViewChild,Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('mySlider', { read: IonSlides }) slides: IonSlides;

  banners: Array<any>;
  routines: Array<any>;
  courses: Array<any>;

sliderConfig = {
  slidesPerView:2.3,
  centeredSlides:false,
}

  constructor(
    public loadingCtrl: LoadingController,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (this.route && this.route.data) {
      this.getData();
    }
  }
  
  async getData(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.route.data.subscribe(routeData => {
      routeData['bannerdata'].subscribe(data => {
        loading.dismiss();
        this.banners = data;
      })
      routeData['routinedata'].subscribe(data => {
        loading.dismiss();
        this.routines = data;
      })
      routeData['coursedata'].subscribe(data => {
        loading.dismiss();
        this.courses = data;
      })
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

}

