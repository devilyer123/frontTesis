import { Component, OnInit } from '@angular/core';
import { Client, Credit, Distribution, selectTypPdf, selecTypPage } from '../../../interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';
import { DistributionService } from 'src/app/services/distribution.service';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { CreditService } from 'src/app/services/credit.service';
import { ClientService } from 'src/app/services/client.service';

import pdfMake from "pdfmake/build/pdfMake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { HttpClient } from '@angular/common/http';
import { Filesystem, FilesystemDirectory } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-entregar-distribucion',
  templateUrl: './entregar-distribucion.page.html',
  styleUrls: ['./entregar-distribucion.page.scss'],
})
export class EntregarDistribucionPage implements OnInit {

  distribution: Distribution[] = [];

  textoBuscar: string = '';

  cli: Client = {
    nomPriCli: '',
    apePatCli: '',
    apeMatCli: ''
  }

  dist: Distribution = {
    nomPro: '',
    cantSolic: 0,
    montoTotal: 0,
    estadoPedido: ''
  }

  cred: Credit = {
    cliId: 0,
    nomPro: '',
    cantVend: 0,
    tipoPago: '',
    montoCred: 0,
    montoCredPend: 0,
    estadoCred: ''
  }

  upTypPage: selecTypPage = {
    typPage: ''
  }

  seTypPdf: selectTypPdf = {
    typPdf: ''
  }

  pdfObj: any;
  logoData = null;
  showlogo = true;

  constructor(private activatedRoute: ActivatedRoute,
    private distributionService: DistributionService,
    private alertController: AlertController,
    private creditService: CreditService,
    private clientService: ClientService,
    private navCtrl: NavController,
    private http: HttpClient,
    private plt: Platform,
    private fileOpener: FileOpener) { }

  ngOnInit() {
    this.searchClient();
    this.loadDistributionByClient();
    this.loadLocalAssetToBase64();
  }

  onSearchChange( event ) {
    this.textoBuscar = event.detail.value;
  }


  loadDistributionByClient() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('idcli')) {
        this.distributionService.getDistributionsByClient(parseInt(paramMap.get('idcli')))
        .subscribe(resp => {
          this.distribution.push(...resp.dataDistributions);
          console.log(this.distribution);
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
          //console.log(this.cli);
        })
      }
    })
  }

  upDist() {
    this.distributionService.updateDistribution(this.dist.iddis, {
      nomPro: this.dist.nomPro,
      cantSolic: this.dist.cantSolic,
      montoTotal: this.dist.montoTotal,
      estadoPedido: this.dist.estadoPedido
    }).subscribe(
      (res) => {
        
        this.navCtrl.navigateRoot('/action2', {animated: true});
        console.log(res);
      },
      (err) => console.log(err)
    )
    this.regSegCredit();
  }

  traspas(any) {
    return this.cred = any;
  }

  regSegCredit() {
    this.creditService.registerCredit({
      cliId: this.cli.idcli,
      nomPro: this.dist.nomPro,
      cantVend: this.dist.cantSolic,
      tipoPago: this.upTypPage.typPage,
      montoCred: this.dist.montoTotal,
      montoCredPend: this.dist.montoTotal,
      estadoCred: 'Pendiente'
    }).subscribe(
      (res) => {
        console.log(res)
      },
      (err) => console.log(err)
    )  
  }

  sumarMonto(ant, act){
    const total = parseInt(ant) + parseInt(act);
    return total;
  }

  async saveDist(id){
    const alert = await this.alertController.create({
      header: 'Seleccione el estado del pedido',
      buttons: [
        {
          text: 'Entregado',
          handler: () => {
            //this.dist.estadoPedido = "Entregado"
            this.distributionService.getOneDistribution(id).subscribe(
              (res) => {
                this.dist = res;
                this.dist.estadoPedido = 'Entregado';
                console.log(this.dist);
              }
            )
          }
        },
        {
          text: 'Pendiente',
          handler: () => {
            //this.distribution.estadoPedido = "Pendiente"
            this.distributionService.getOneDistribution(id).subscribe(
              (res) => {
                this.dist = res;
                this.dist.estadoPedido = 'Pendiente';
                console.log(this.dist);
              }
            )
          }
        }
      ]
    })
    await alert.present();
  }

  async savetypPage(){
    const alert = await this.alertController.create({
      header: 'Seleccione el tipo de Pago',
      buttons: [
        {
          text: 'A Credito',
          handler: () => {
            this.upTypPage.typPage = 'A Credito'
          }
        },
        {
          text: 'Al Contado',
          handler: () => {
            this.upTypPage.typPage = 'Al Contado'
          }
        }
      ]
    })
    await alert.present();
  }

  compare(est: string){
    if (est === 'Pendiente'){
      return true;
    } else {
      return false;
    }
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
          text: 'Entregado',
          handler: () => {
            this.seTypPdf.typPdf = 'Entregado';
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
    let logo = {};
    if (this.showlogo) {
      logo = { image: this.logoData, width: 75 };
    }
    var body2 = [];
    if (tyPdf == 'Pendiente') {
      body2.push(['Nombre del Producto',
      'Cantidad Solicitada',
      'Monto Total del Pedido',
      'Fecha del Pedido',
      'Estado del Pedido'])
      for(let i=0; i< this.distribution.length; i++) {
        if (tyPdf == this.distribution[i].estadoPedido) {
          body2.push([this.distribution[i].nomPro, 
            this.distribution[i].cantSolic, 
            this.distribution[i].montoTotal, 
            this.distribution[i].createdAt,
            this.distribution[i].estadoPedido]);
        }        
      }
    } else {
      if (tyPdf == 'Entregado') {
        body2.push(['Nombre del Producto',
        'Cantidad Solicitada',
        'Monto Total del Pedido',
        'Fecha de Entrega',
        'Estado del Pedido'])
        for(let i=0; i< this.distribution.length; i++) {
          if (tyPdf == this.distribution[i].estadoPedido) {
            body2.push([this.distribution[i].nomPro, 
              this.distribution[i].cantSolic, 
              this.distribution[i].montoTotal, 
              this.distribution[i].createdAt,
              this.distribution[i].estadoPedido]);
          }        
        }
      } else {
        if (tyPdf == 'Ambos') {
          body2.push(['Nombre del Producto',
          'Cantidad Solicitada',
          'Monto Total del Pedido',
          'Fecha del Pedido/Entrega',
          'Estado del Pedido'])
          for(let i=0; i< this.distribution.length; i++) {
            body2.push([this.distribution[i].nomPro, 
              this.distribution[i].cantSolic, 
              this.distribution[i].montoTotal, 
              this.distribution[i].createdAt,
              this.distribution[i].estadoPedido]);     
          }          
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
              text: new Date().toTimeString(),
              alignment: 'right'
            }
          ]
        },
        { text: 'SEGUIMIENTO DE DISTRIBUCIONES', style: 'header', alignment: 'center' },
        { text: 'Lista de Seguimiento de Distribuciones del Cliente', style: 'subheader', alignment: 'center' },
        'Listado actual de todos los distribuciones del cliente: '+ this.cli.nomPriCli+' '+this.cli.apePatCli+' '+this.cli.apeMatCli,
        {
          style: 'tableExample',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
            headerRows: 1,
            body: body2,
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

}
