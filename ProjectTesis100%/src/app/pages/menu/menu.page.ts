import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { MenuCompenente } from '../../interfaces/interfaces';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  activities: MenuCompenente[] = [];


  constructor(private router: Router, 
    private dataService: DataService,
    public menuCtrl: MenuController) { }

  ngOnInit() {

    this.dataService.getProducts()
    .subscribe( resp => {
      console.log(resp);
    });

  }

  CloseToLogin(){
    this.router.navigate(['/login']);
  }

}