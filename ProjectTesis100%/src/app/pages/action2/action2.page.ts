import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Client, Distribution, listVisDist, Order } from 'src/app/interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { ClientService } from 'src/app/services/client.service';
import { DistributionService } from 'src/app/services/distribution.service';

interface compDis {
  name: string,
  numberProducts: number,
  fechaRegistro: Date,
  estadoPedido: string
}

@Component({
  selector: 'app-action2',
  templateUrl: './action2.page.html',
  styleUrls: ['./action2.page.scss'],
})
export class Action2Page implements OnInit {

  clients: Client[] = [];

  textoBuscar: string = '';

  distrPed: compDis[] = [
    {
      name: 'Alfredo Ramirez',
      numberProducts: 16,
      fechaRegistro: new Date("2021-11-30"),
      estadoPedido: 'Pendiente'
    },
    {
      name: 'Luciana Pereira',
      numberProducts: 24,
      fechaRegistro: new Date("2021-11-29"),
      estadoPedido: 'Pendiente'
    },
    {
      name: 'Daniel Guzman',
      numberProducts: 32,
      fechaRegistro: new Date("2021-11-28"),
      estadoPedido: 'Entregado'
    }
  ];

  ord: Distribution[] = [];

  listDist: listVisDist[] = [];

  vacio: Distribution[] = [];

  distsPendiente: number = 0;

  constructor(private router: Router,
    private usuarioService: UsuarioService,
    private clientService: ClientService,
    private distributionService: DistributionService) { }

  ngOnInit() {
    this.loadClientByUser();
  }

  onSearchChange( event ) {
    this.textoBuscar = event.detail.value;
  }

  doRefresh( event ) {
    this.clients = [];
    this.listDist = [];
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
      this.loadListClient();
    });
  }

  loadListClient() {
    for(let i = 0; i < this.clients.length; i++) {
      this.distributionService.getDistributionsByClient(this.clients[i].idcli)
      .subscribe(resp => {
        this.ord.push(...resp.dataDistributions);
        this.distsPendiente = 0;
        for(let y = 0; y < this.ord.length; y++) {
          if(this.ord[y].estadoPedido == 'Pendiente'){
            this.distsPendiente = this.distsPendiente + 1;
          }
        }
        this.listDist[i]= {
          idcli: this.clients[i].idcli,
          nomPriCli: this.clients[i].nomPriCli,
          apePatCli: this.clients[i].apePatCli,
          apeMatCli: this.clients[i].apeMatCli,
          totalLista: this.ord.length,
          nroDists: this.distsPendiente
        }
        this.ord = [];
      })      
    }
    //console.log(this.listPed);
  }

  entrPed(){
    this.router.navigate(['/crear-distribucion'])
  }

}
