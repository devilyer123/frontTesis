import { Component, OnInit } from '@angular/core';
import { Client, Credit, listVis, Order } from 'src/app/interfaces/interfaces';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { ClientService } from 'src/app/services/client.service';

import pdfMake from "pdfmake/build/pdfMake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { CreditService } from 'src/app/services/credit.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface compCred {
  name: string,
  montoTotal: number,
  fechaRegistro: Date,
  tipoPago: string
}

@Component({
  selector: 'app-action3',
  templateUrl: './action3.page.html',
  styleUrls: ['./action3.page.scss'],
})
export class Action3Page implements OnInit {

  clients: Client[] = [];

  ord: Credit[] = [];

  listCred: listVis[] = [];

  vacio: Credit[] = [];

  textoBuscar: string = '';

  myForm: FormGroup
  pdfObj: any;
  base64Image = null;
  photoPreview = null;
  logoData = null;
  showlogo = true;

  /*listCred: compCred[] = [
    {
      name: 'Alfredo Ramirez',
      montoTotal: 16200,
      fechaRegistro: new Date("2021-11-30"),
      tipoPago: 'Credito'
    },
    {
      name: 'Luciana Pereira',
      montoTotal: 24620,
      fechaRegistro: new Date("2021-11-29"),
      tipoPago: 'Contado'
    },
    {
      name: 'Daniel Guzman',
      montoTotal: 32640,
      fechaRegistro: new Date("2021-11-28"),
      tipoPago: 'Credito'
    }
  ];*/

  constructor(private router: Router,
    private usuarioService: UsuarioService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private plt: Platform,
    private http: HttpClient,
    private fileOpener: FileOpener,
    private alertController: AlertController,
    private creditService: CreditService) { }

  ngOnInit() {
    this.loadClientByUser();
    this.loadLocalAssetToBase64();
  }

  onSearchChange( event ) {
    this.textoBuscar = event.detail.value;
  }

  async loadClientByUser() {
    const iduser = await this.usuarioService.obtenerUserByToken();
    this.clientService.getClientsByUser(iduser)
    .subscribe(resp => {
      this.clients.push(...resp.dataClients);
      //console.log(this.clients);
      this.loadListClient();
    });    
  }

  loadListClient() {
    for(let i = 0; i < this.clients.length; i++) {
      this.creditService.getCreditsByClient(this.clients[i].idcli)
      .subscribe(resp => {
        this.ord.push(...resp.dataCredits);
        this.listCred[i]= {
          idcli: this.clients[i].idcli,
          nomPriCli: this.clients[i].nomPriCli,
          apePatCli: this.clients[i].apePatCli,
          apeMatCli: this.clients[i].apeMatCli,
          totalLista: this.ord.length
        }
        this.ord = [];
      })      
    }
    //console.log(this.listPed);
  }

  generatePDF2(){
    var body2 = [];

    //body2.push(['Nr.', 'Name', 'Beschreibung', 'Preis', 'Anzahl', 'MwSt(%)']);

    console.log(this.clients.length)
    for(let i=0; i < this.clients.length; i++) {
      body2.push([this.clients[i].nomPriCli +" "+ this.clients[i].apePatCli +" "+ this.clients[i].apeMatCli]);
    }

    let docDefinition = {
      content: [
        {
          table: {
            widths: ['auto'],
            body: body2
          }
        }
      ]
    }

    /*body2.push(['Nr.', 'Name', 'Beschreibung', 'Preis', 'Anzahl', 'MwSt(%)']);

    for(var i of [1,2,3,4]) {
      body2.push(['#.'+i, 'xx', 'xx', 'xx', 'xx', 'xx']);
    }

    let docDefinition = {
      content: [
        {
          table: {
            widths: ['*', 100, 200, '*', '*', '*'],
            body: body2
          }
        }
      ]
    }*/
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.pdfObj.download();
  }

  generatePDF() {
    let logo = {};
    if (this.showlogo) {
      logo = { image: this.logoData, width: 75 };
    }
    var body2 = [];
    console.log(this.clients)
    for(let i=0; i < this.clients.length; i++) {
      body2.push([this.clients[i].nomPriCli +" "+ this.clients[i].apePatCli +" "+ this.clients[i].apeMatCli]);
    }
    let docDefinition = {
      content: [
        {
          columns: [
            logo,
            {
              text: new Date().toTimeString(),
              alignment: 'right'
            }
          ]
        },
        { text: 'SEGUIMIENTO DE CREDITOS', style: 'header', alignment: 'center' },
        { text: 'Lista de Seguimiento de Creditos de los Clientes', style: 'subheader', alignment: 'center' },
        'Listado actual de todos los creditos registrados de los clientes.',
        {
          style: 'tableExample',
          table: {
            widths: ['auto'],
            headerRows: 1,
            //body: body2
            /*[
              [{text: 'Alfredo Loma Ramirez', style: 'tableHeader', colSpan: 1, alignment: 'center'}],
              [{text: 'Vicente Hidalgo Rosso', style: 'tableHeader', colSpan: 1, alignment: 'center'}],
              [{text: 'Sebastian Arze Pando', style: 'tableHeader', colSpan: 1, alignment: 'center'}],
              [{text: 'Oscar Ortiz Mayorga', style: 'tableHeader', colSpan: 1, alignment: 'center'}],
            ]*/
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15],
          bold: true,
          fontSize: 13,
          color: 'black',
          alignment: 'center'
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }
    };

    this.pdfObj = pdfMake.createPdf(docDefinition);
    console.log(this.pdfObj);

    //this.pdfObj.download();*/
  }

  loadLocalAssetToBase64() {
    this.http.get('./assets/img/logo.jpg', { responseType: 'blob' })
    .subscribe(res => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.logoData = reader.result;
      }
      reader.readAsDataURL(res);
    })
  }

  createPdf() {
    let logo = {};
    if (this.showlogo) {
      logo = { image: this.logoData, width: 75 };
    }
    const docDefinition = {
      watemark: { text: 'Importadora Rocha', color: 'blue', opacity: 0.2, bold: true },
      content:[
        {
          columns: [
            logo,
            {
              text: new Date().toTimeString(),
              alignment: 'right'
            }
          ]
        },
        { text: 'SEGUIMIENTO DE CREDITOS', style: 'header', alignment: 'center' },
        { text: 'Lista de Seguimiento de Creditos de los Clientes', style: 'subheader', alignment: 'center' },
        'Listado actual de todos los creditos registrados de los clientes.',
        {
          style: 'tableExample',
          table: {
            witdhs: ['auto'],
            headerRows: 1,
            body: [
              [{text: 'Alfredo Loma Ramirez', style: 'tableHeader', colSpan: 1, alignment: 'center'}],
              [
                [
                  'Lista actual de los creditos del cliente',
                  {
                    table: {
                      widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                      headerRows: 1,
                      body: [
                        //[{text: 'Nombre del Cliente', style: 'tableHeader', colSpan: 6, alignment: 'center'}, {}, {}, {}, {}, {}],
                        [{text: 'Nombre del Producto', style: 'tableHeader', alignment: 'center'},
                        {text: 'Cantidad Vendida', style: 'tableHeader', alignment: 'center'},
                        {text: 'Monto Total de la Venta', style: 'tableHeader', alignment: 'center'},
                        {text: 'Tipo de Pago del Credito', style: 'tableHeader', alignment: 'center'},
                        {text: 'Monto de Credito Pendiente', style: 'tableHeader', alignment: 'center'},
                        {text: 'Estado del Credito', style: 'tableHeader', alignment: 'center'}],
                        ['Barbijos quirurgicos pediatricos',
                        '10',
                        '250',
                        'Al Credito',
                        '130',
                        'Pendiente'],
                      ]
                    }
                  }
                ]
              ],
              [{text: 'Vicente Hidalgo Rosso', style: 'tableHeader', colSpan: 1, alignment: 'center'}],
              [
                [
                  'Lista actual de los creditos del cliente',
                  {
                    table: {
                      widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                      headerRows: 1,
                      body: [
                        //[{text: 'Nombre del Cliente', style: 'tableHeader', colSpan: 6, alignment: 'center'}, {}, {}, {}, {}, {}],
                        [{text: 'Nombre del Producto', style: 'tableHeader', alignment: 'center'},
                        {text: 'Cantidad Vendida', style: 'tableHeader', alignment: 'center'},
                        {text: 'Monto Total de la Venta', style: 'tableHeader', alignment: 'center'},
                        {text: 'Tipo de Pago del Credito', style: 'tableHeader', alignment: 'center'},
                        {text: 'Monto de Credito Pendiente', style: 'tableHeader', alignment: 'center'},
                        {text: 'Estado del Credito', style: 'tableHeader', alignment: 'center'}],
                        ['Torniquete de Liga',
                        '14',
                        '70',
                        'Al Contado',
                        '0',
                        'Cancelado'],
                      ]
                    }
                  }
                ]
              ],
              [{text: 'Sebastian Arze Pando', style: 'tableHeader', colSpan: 1, alignment: 'center'}],
              [
                [
                  'Lista actual de los creditos del cliente',
                  {
                    table: {
                      widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                      headerRows: 1,
                      body: [
                        //[{text: 'Nombre del Cliente', style: 'tableHeader', colSpan: 6, alignment: 'center'}, {}, {}, {}, {}, {}],
                        [{text: 'Nombre del Producto', style: 'tableHeader', alignment: 'center'},
                        {text: 'Cantidad Vendida', style: 'tableHeader', alignment: 'center'},
                        {text: 'Monto Total de la Venta', style: 'tableHeader', alignment: 'center'},
                        {text: 'Tipo de Pago del Credito', style: 'tableHeader', alignment: 'center'},
                        {text: 'Monto de Credito Pendiente', style: 'tableHeader', alignment: 'center'},
                        {text: 'Estado del Credito', style: 'tableHeader', alignment: 'center'}],
                        ['Torniquete de Liga',
                        '10',
                        '50',
                        'Al Contado',
                        '0',
                        'Cancelado'],
                      ]
                    }
                  }
                ]
              ],
              [{text: 'Oscar Ortiz Mayorga', style: 'tableHeader', colSpan: 1, alignment: 'center'}],
              [
                [
                  'Lista actual de los creditos del cliente',
                  {
                    table: {
                      widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                      headerRows: 1,
                      body: [
                        //[{text: 'Nombre del Cliente', style: 'tableHeader', colSpan: 6, alignment: 'center'}, {}, {}, {}, {}, {}],
                        [{text: 'Nombre del Producto', style: 'tableHeader', alignment: 'center'},
                        {text: 'Cantidad Vendida', style: 'tableHeader', alignment: 'center'},
                        {text: 'Monto Total de la Venta', style: 'tableHeader', alignment: 'center'},
                        {text: 'Tipo de Pago del Credito', style: 'tableHeader', alignment: 'center'},
                        {text: 'Monto de Credito Pendiente', style: 'tableHeader', alignment: 'center'},
                        {text: 'Estado del Credito', style: 'tableHeader', alignment: 'center'}],
                        ['Guantes de Nitrilo Dermagrip',
                        '5',
                        '700',
                        'A Credito',
                        '450',
                        'Pendiente'],
                      ]
                    }
                  }
                ]
              ]  
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.alertGenPDF();
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {

    } else {
      this.pdfObj.download();
    }
  }

  async alertGenPDF() {
    const alert = await this.alertController.create({
      header: 'Se genero el reporte de manera satisfactoria',
      subHeader: 'Esta disponible para la descarga',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

}
