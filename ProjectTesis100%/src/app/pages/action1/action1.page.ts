import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { Client, Credit, listCredDisp, listVisPed, Order, User } from 'src/app/interfaces/interfaces';
import { ClientService } from 'src/app/services/client.service';
import { CreditService } from 'src/app/services/credit.service';
import { OrderService } from 'src/app/services/order.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PopoverInfoComponent } from '../../components/popover-info/popover-info.component';

interface compPed {
  name: string,
  numberProducts: number,
  fechaRegistro: Date
}

@Component({
  selector: 'app-action1',
  templateUrl: './action1.page.html',
  styleUrls: ['./action1.page.scss'],
})
export class Action1Page implements OnInit {

  clients: Client[] = []; 

  textoBuscar: string = '';

  ord: Order[] = [];

  ord2: Credit[] = [];

  listPed: listVisPed[] = [];

  listCre: listCredDisp[] = [];

  vacio: Order[] = [];

  cantCredPend: number = 0;

  /*pedidos: compPed[] = [
    {
      name: 'Alfredo Ramirez',
      numberProducts: 16,
      fechaRegistro: new Date("2021-11-30")
    },
    {
      name: 'Luciana Pereira',
      numberProducts: 24,
      fechaRegistro: new Date("2021-11-29")
    },
    {
      name: 'Daniel Guzman',
      numberProducts: 32,
      fechaRegistro: new Date("2021-11-28")
    }
  ];*/

  constructor(private popoverCtrl: PopoverController,
    private router: Router,
    private usuarioService: UsuarioService,
    private clientService: ClientService,
    private alertController: AlertController,
    private orderService: OrderService,
    private creditService: CreditService) { }

  ngOnInit() {
    this.loadClientByUser();
    //this.doRefresh( event );
    //this.loadListClient();
  }

  onSearchChange( event ) {
    this.textoBuscar = event.detail.value;
  }

  doRefresh( event ) {
    this.clients = [];
    this.listPed = [];
    setTimeout(() => {
      //console.log(this.loadClientByUser());
      this.loadClientByUser();
      event.target.complete();
    }, 10);
  }

  async loadClientByUser() {
    const iduser = await this.usuarioService.obtenerUserByToken();
    this.clientService.getClientsByUser(iduser)
    .subscribe(resp => {
      this.clients.push(...resp.dataClients);
      //console.log(resp);
      //console.log(this.clients);
      this.loadDisCred();
    });
  }

  loadListClient(i, cantcred) {
    //for(let i = 0; i < this.clients.length; i++) {
      this.orderService.getOrdersByClient(this.clients[i].idcli)
      .subscribe(resp => {
        this.ord.push(...resp.dataOrders);
        this.listPed[i]= {
          idcli: this.clients[i].idcli,
          nomPriCli: this.clients[i].nomPriCli,
          apePatCli: this.clients[i].apePatCli,
          apeMatCli: this.clients[i].apeMatCli,
          totalLista: this.ord.length,
          cantCredDisp: this.creditAvailable(cantcred)
        }
        this.ord = [];
      })      
    //}
    //console.log(this.listPed);
  }

  loadDisCred(){
    for(let i = 0; i < this.clients.length; i++){
      this.creditService.getCreditsByClient(this.clients[i].idcli)
      .subscribe(resp => {
        this.ord2.push(...resp.dataCredits);
        this.cantCredPend = 0;
        for(let y = 0; y < this.ord2.length; y++){
          this.cantCredPend = this.cantCredPend + this.ord2[y].montoCredPend;
        }
        this.loadListClient(i, this.cantCredPend);
        //console.log(this.cantCredPend);
        this.ord2 = [];
      })
    }
    
  }

  crePedido(){
    this.router.navigate(['/action1/register-client']);
  }

  async delCli(id) {
    const alert = await this.alertController.create({
      header: 'Mensaje de Alerta',
      subHeader: 'Esta por eliminar este Cliente',
      message: 'Desea eliminarlo?',
      buttons: [
        {
          text: 'Eliminar',
          handler: () => {
            console.log(id);
            this.clientService.getDelete(id).subscribe(
              (res) => {
                //this.loadClientByUser();
                this.doRefresh(event);
                console.log(res);
              },
              (err) => console.log(err)
            );
          }
        },'Cancelar']
    });
    await alert.present();
  }

  creditAvailable(credUtlz){
    const credDisp = 30000 - parseInt(credUtlz);
    return credDisp;
  }

}
