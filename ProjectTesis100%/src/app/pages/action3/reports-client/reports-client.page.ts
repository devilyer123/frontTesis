import { Component, OnInit } from '@angular/core';
import { Client, Credit, selectTypPdf } from 'src/app/interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';
import { CreditService } from 'src/app/services/credit.service';
import { ClientService } from 'src/app/services/client.service';
import { AlertController, NavController, Platform } from '@ionic/angular';

import pdfMake from "pdfmake/build/pdfMake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { HttpClient } from '@angular/common/http';
import { Filesystem, FilesystemDirectory } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { now } from 'moment';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as moment from 'moment';

@Component({
  selector: 'app-reports-client',
  templateUrl: './reports-client.page.html',
  styleUrls: ['./reports-client.page.scss'],
})
export class ReportsClientPage implements OnInit {

  fechaInicial: Date = new Date();
  fechaFinal: Date = new Date();

  credit: Credit[] = [];
  
  cli: Client = {
    nomPriCli: '',
    apePatCli: '',
    apeMatCli: ''
  }

  seTypPdf: selectTypPdf = {
    typPdf: ''
  }

  pdfObj: any;
  logoData = null;
  showlogo = true;

  constructor(private activatedRoute: ActivatedRoute,
    private creditService: CreditService,
    private clientService: ClientService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private http: HttpClient,
    private plt: Platform,
    private fileOpener: FileOpener) { }

  ngOnInit() {
    this.searchClient();
    this.loadCreditByClient();
    this.loadLocalAssetToBase64();
  }

  loadCreditByClient() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('idcli')) {
        this.creditService.getCreditsByClient(parseInt(paramMap.get('idcli')))
        .subscribe(resp => {
          this.credit.push(...resp.dataCredits);
          console.log(this.credit);
        })
      }
    })
  }

  searchClient() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('idcli')) {
        this.clientService.getOneClient(parseInt(paramMap.get('idcli')))
        .subscribe(res => {
          this.cli = res;
          console.log(this.cli);
        })
      }
    })
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

  async selectPdf() {
    const alert = await this.alertController.create({
      header: 'Seleccione el tipo de PDF que desea generar',
      buttons: [
        {
          text: 'Pendiente',
          handler: () => {
            this.seTypPdf.typPdf = 'Pendiente';
            this.createPdf(this.seTypPdf.typPdf);
          }
        },
        {
          text: 'Cancelado',
          handler: () => {
            this.seTypPdf.typPdf = 'Cancelado';
            this.createPdf(this.seTypPdf.typPdf);
          }
        },
        {
          text: 'Ambos',
          handler: () => {
            this.seTypPdf.typPdf = 'Ambos';
            this.createPdf(this.seTypPdf.typPdf);
          }
        }
      ]
    })
    await alert.present();
  }

  createPdf(tyPdf) {
    console.log((new Date(this.fechaInicial).getTime()));
    console.log((new Date(this.fechaFinal).getTime()));
    //console.log(this.fechaInicial.getTime());
    //console.log(this.fechaFinal.getTime());
    let logo = {};
    if (this.showlogo) {
      logo = { image: this.logoData, width: 75 };
    }
    var body2 = [];
    body2.push(['Nombre del Producto',
    'Cantidad Vendida',
    'Monto Total de la Venta', 
    'Tipo de Pago del Credito', 
    'Monto de Credito Pendiente',
    'Ultimo Pago Realizado',
    'Estado del Credito'])
    if (tyPdf == 'Pendiente' || tyPdf == 'Cancelado') {
      for(let i=0; i< this.credit.length; i++) {
        if (tyPdf == this.credit[i].estadoCred) {
          //if ( this.credit[i].updatedAt >= this.fechaInial && this.credit[i].updatedAt <= this.fechaFinal) {
            body2.push([this.credit[i].nomPro, 
              this.credit[i].cantVend, 
              this.credit[i].montoCred, 
              this.credit[i].tipoPago,
              this.credit[i].montoCredPend,
              this.credit[i].updatedAt,
            this.credit[i].estadoCred]);
          //}          
        }
      }
    } else {
      if (tyPdf == 'Ambos') {
        for(let i=0; i< this.credit.length; i++) {
          if (new Date(this.credit[i].updatedAt).getTime() >= new Date(this.fechaInicial).getTime() && 
              new Date(this.credit[i].updatedAt).getTime() <= new Date(this.fechaFinal).getTime()) {
            body2.push([this.credit[i].nomPro, 
              this.credit[i].cantVend, 
              this.credit[i].montoCred, 
              this.credit[i].tipoPago,
              this.credit[i].montoCredPend,
              moment(this.credit[i].updatedAt).format('DD/MM/YYYY, h:mm:ss a'),
              this.credit[i].estadoCred]);
            //console.log(new Date(this.credit[i].updatedAt).getTime());
          }
          //console.log(moment(this.credit[i].updatedAt).format('DD MMMM YYYY'));
        }
      }
    }
    console.log(body2);
    const docDefinition = {
      watermark: { text: 'Importadora Rocha', color: 'blue', opacity: 0.2, bold: true/*, italics: false*/ },
      content: [
        {
          columns: [
            logo,
            {
              text: moment(new Date()).format('DD MMMM YYYY, h:mm:ss a'),
              alignment: 'right'
            }
          ]
        },
        { text: 'SEGUIMIENTO DE CREDITOS', style: 'header', alignment: 'center' },
        { text: 'Lista de Seguimiento de Creditos del Cliente', style: 'subheader', alignment: 'center' },
        'Listado actual de todos los creditos del cliente: '+ this.cli.nomPriCli+' '+this.cli.apePatCli+' '+this.cli.apeMatCli,
        {
          style: 'tableExample',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            headerRows: 1,
            body: body2
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
    console.log(this.pdfObj);
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBase64(async (data) => {
        try {
          let path = `pdf/myletter_${Date.now}.pdf`;
          const result = await Filesystem.writeFile({
            path,
            data,
            directory: FilesystemDirectory.Documents,
            recursive: true
          });
          this.fileOpener.open(`${result.uri}`, 'application/pdf');
        } catch (e) {
          console.error('Unable to write file', e);
        }
      });
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

  cambioFecha(event) {
    console.log(event);
    console.log(new Date(event.detail.value));
  }

}
