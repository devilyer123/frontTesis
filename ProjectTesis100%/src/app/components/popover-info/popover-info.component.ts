import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

interface compOpt {
  name: string,
  redirectTo: string
}

@Component({
  selector: 'app-popover-info',
  templateUrl: './popover-info.component.html',
  styleUrls: ['./popover-info.component.scss'],
})
export class PopoverInfoComponent implements OnInit {

  items = Array(40);

  options: compOpt[] = [
    {
      name: 'Editar',
      redirectTo: '/crear-pedido'
    },
    {
      name: 'Eliminar',
      redirectTo: '/eliminar-pedido'
    }
  ];
  
  constructor(private popoverCtrl: PopoverController, private router: Router) { }

  ngOnInit() {}

  openOption(rut: string){

    /*this.popoverCtrl.dismiss({
      options: rut
    });*/

    this.router.navigate([rut]);
  }

  onClick( valor: number ) {
    console.log(valor);
  }

}
