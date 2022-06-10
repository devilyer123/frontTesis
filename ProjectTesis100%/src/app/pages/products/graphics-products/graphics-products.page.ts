import { Component, OnInit } from '@angular/core';
import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);
import { utils } from 'protractor';
import { Credit, Distribution, listProdGrap, listProdGrapCred, listProdGrapDist, Order, Product } from 'src/app/interfaces/interfaces';
import { CreditService } from 'src/app/services/credit.service';
import { DataService } from 'src/app/services/data.service';
import { DistributionService } from 'src/app/services/distribution.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-graphics-products',
  templateUrl: './graphics-products.page.html',
  styleUrls: ['./graphics-products.page.scss'],
})
export class GraphicsProductsPage implements OnInit {

  products: Product[] = [];

  orders: Order[] = [];

  listDataGrap: listProdGrap[] = [];

  total: number = 0;
  totalStock: number = 0;

  distributions: Distribution[] = [];

  listDataGrapDist: listProdGrapDist[] = [];

  totalDistPend: number = 0;
  totalDistEntr: number = 0;

  credits: Credit[] = [];

  listDataGrapCred: listProdGrapCred[] = [];

  totalCredPend: number = 0;
  totalCredCanc: number = 0;

  private productChart: Chart;

  private prodctChartDist: Chart;

  private prodctChartCred: Chart;

  constructor(private dataService: DataService,
    private orderService: OrderService,
    private distributionService: DistributionService,
    private creditService: CreditService) { }

  ngOnInit() {
    this.loadProductsAndOrders();
    this.loadDistribution();
    this.loadCredit();
  }

  loadProductsAndOrders() {
    this.dataService.getProducts()
    .subscribe( resp => {
      this.products.push(...resp.dataProds);
      //console.log(this.products);
      this.orderService.getOrders()
      .subscribe( resp => {
        this.orders.push(...resp.dataOrders);
        //console.log(this.orders);
        this.loadDataGraphic();
      })
    });
  }

  loadDistribution() {
    this.distributionService.getDistributions()
    .subscribe( resp => {
      this.distributions.push(...resp.dataDistributions);
      //console.log(this.distributions);
      this.loadDataGraphicDist();
    })
  }

  loadCredit() {
    this.creditService.getCredits()
    .subscribe( resp => {
      this.credits.push(...resp.dataCredits);
      //console.log(this.credits);
      this.loadDataGraphicCred();
    })
  }

  loadDataGraphic() {
    for(let i = 0; i < this.products.length; i++) {
      this.total = 0;
      this.totalStock = 0;
      for(let x = 0; x < this.orders.length; x++) {
        if (this.products[i].idpro == this.orders[x].proId)
        {
          this.total = this.total + this.orders[x].cantSolic;
        }
      }
      this.listDataGrap[i] = {
        nomPro: this.products[i].nomProd,
        cantVend: this.total,
        cantStock: this.products[i].cantDisp
      }
    }
    this.generateCharts();
    this.generateChartsSalesStock();
  }

  loadDataGraphicDist() {
    this.totalDistPend = 0;
    this.totalDistEntr = 0;
    for(let i = 0; i < this.distributions.length; i++) {
      if(this.distributions[i].estadoPedido == 'Entregado') {
        this.totalDistEntr = this.totalDistEntr + 1;
      }
      if(this.distributions[i].estadoPedido == 'Pendiente') {
        this.totalDistPend = this.totalDistPend + 1;
      }      
    }
    this.listDataGrapDist[0] = {
      estadDist: 'Distribuciones Entregadas',
      cantDist: this.totalDistEntr
    }
    this.listDataGrapDist[1] = {
      estadDist: 'Distribuciones Pendientes',
      cantDist: this.totalDistPend
    }
    console.log(this.listDataGrapDist);
    this.generateChartsDist();
  }

  loadDataGraphicCred() {
    this.totalCredPend = 0;
    this.totalCredCanc = 0;
    for(let i = 0; i < this.credits.length; i++) {
      if(this.credits[i].estadoCred == 'Cancelado') {
        this.totalCredCanc = this.totalCredCanc + 1;
      }
      if(this.credits[i].estadoCred == 'Pendiente') {
        this.totalCredPend = this.totalCredPend + 1;
      }
    }
    this.listDataGrapCred[0] = {
      estadCred: 'Creditos Cancelados',
      cantCred: this.totalCredCanc
    }
    this.listDataGrapCred[1] = {
      estadCred: 'Creditos Pendientes',
      cantCred: this.totalCredPend
    }
    console.log(this.listDataGrapCred);
    this.generateChartsCred();
  }

  generateCharts() {
    //console.log(this.listDataGrap);
    const canvas = <HTMLCanvasElement> document.getElementById('prod-chart');
    const ctx = canvas.getContext('2d');

    const colors = [
      "#ffc409",
      "#eb445a",
      "#3dc2ff",
      "#B22222",
      "#2fdf75",
      "#000080",
      "#8A2BE2",
      "#FFEBCD",
      "#4169E1",
      "#FF00FF"
    ];

    let i = -1;
    const graphicColors = this.listDataGrap.map(_ => colors[(i = (i + 1) % colors.length)]);
    
    this.productChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: this.listDataGrap.map(m => m.nomPro)/*[]*/,
            datasets: [{
                data: this.listDataGrap.map(m => m.cantVend),
                backgroundColor: graphicColors,
                borderColor: graphicColors,
                borderWidth: 1
            }]
        },
        options: {
          plugins: {
            /*tooltip: {
              enabled: false
            },*/
            datalabels: {
              align: 'center',
              color: 'white',
              formatter: (value, context) => {
                //console.log(value);
                //console.log(context.chart.data.datasets[0].data);
                const datapoints = context.chart.data.datasets[0].data;
                function totalSum(total, datapoint) {
                  return total + datapoint;
                }
                const totalvalue = datapoints.reduce(totalSum, 0);
                const porcentageValue = (value / totalvalue * 100).toFixed(1);
                const display = [`Cant:${value}`, `${porcentageValue}%`]
                return display;
              }
            }
          }
        },
        plugins: [ChartDataLabels]
    });
  }

  generateChartsDist() {
    const canvas = <HTMLCanvasElement> document.getElementById('prod-chart-dist');
    const ctx = canvas.getContext('2d');
    this.prodctChartDist = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.listDataGrapDist.map(m => m.estadDist),
        datasets: [{
          data: this.listDataGrapDist.map(m => m.cantDist),
          backgroundColor: [
            "#3939ff",
            //"#1c1cff",
            "#c6c6ff"
            //"#e3e3ff"
            
          ],
          borderColor: [
            "#3939ff",
            //"#1c1cff",
            "#c6c6ff"
            //"#e3e3ff"
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          /*tooltip: {
            enabled: false
          },*/
          datalabels: {
            align: 'center',
            color: 'white',
            formatter: (value, context) => {
              //console.log(value);
              //console.log(context.chart.data.datasets[0].data);
              const datapoints = context.chart.data.datasets[0].data;
              function totalSum(total, datapoint) {
                return total + datapoint;
              }
              const totalvalue = datapoints.reduce(totalSum, 0);
              const porcentageValue = (value / totalvalue * 100).toFixed(1);
              const display = [`Cant:${value}`, `${porcentageValue}%`]
              return display;
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }

  generateChartsCred() {
    const canvas = <HTMLCanvasElement> document.getElementById('prod-chart-cred');
    const ctx = canvas.getContext('2d');
    this.prodctChartCred = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.listDataGrapCred.map(m => m.estadCred),
        datasets: [{
          data: this.listDataGrapCred.map(m => m.cantCred),
          backgroundColor: [
            "#39be46",
            //"#1cb42b",
            "#c6ecca"
            //"#e3f6e5"
            
          ],
          borderColor: [
            "#39be46",
            //"#1cb42b",
            "#c6ecca"
            //"#e3f6e5"
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          /*tooltip: {
            enabled: false
          },*/
          datalabels: {
            align: 'center',
            color: 'white',
            formatter: (value, context) => {
              //console.log(value);
              //console.log(context.chart.data.datasets[0].data);
              const datapoints = context.chart.data.datasets[0].data;
              function totalSum(total, datapoint) {
                return total + datapoint;
              }
              const totalvalue = datapoints.reduce(totalSum, 0);
              const porcentageValue = (value / totalvalue * 100).toFixed(1);
              const display = [`Cant:${value}`, `${porcentageValue}%`]
              return display;
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    })
  }

  generateChartsSalesStock() {
    //console.log(this.listDataGrap);
    const canvas = <HTMLCanvasElement> document.getElementById('prod-chart-sales-stock');
    const ctx = canvas.getContext('2d');

    const colors = [
      "#ffc409",
      "#e7213b",
      "#02afff",
      "#d93636",
      "#2fdf75",
      "#0a0aff",
      "#8A2BE2",
      "#ff9d09",
      "#305cde",
      "#ff14ff"
    ];

    const colors2 = [
      "#ffebba",
      "#f8c0c7",
      "#b3e7ff",
      "#f2baba",
      "#c8f7db",
      "#bbbbff",
      "#e0c6f7",
      "#ffe3b9",
      "#c9d4f6",
      "#ffc4ff"
    ]

    let i = -1;
    const graphicColors = this.listDataGrap.map(_ => colors[(i = (i + 1) % colors.length)]);
    let y = -1;
    const graphicColors2 = this.listDataGrap.map(_ => colors2[(y = (y + 1) % colors.length)]);
    
    this.productChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: this.listDataGrap.map(m => m.nomPro)/*[]*/,
            datasets: [
              {
                label: 'Productos Vendidos',
                data: this.listDataGrap.map(m => m.cantVend),
                backgroundColor: graphicColors,
                borderColor: graphicColors,
                borderWidth: 1
              },
              {
                label: 'Productos Stock',
                data: this.listDataGrap.map(m => m.cantStock),
                backgroundColor: graphicColors2,
                borderColor: graphicColors2,
                borderWidth: 1
              }]
        },
        options: {
          plugins: {
            /*tooltip: {
              enabled: false
            },*/
            datalabels: {
              align: 'center',
              color: 'white',
              formatter: (value, context) => {
                //console.log(value);
                //console.log(context.chart.data.datasets[0].data);
                const datapoints = context.chart.data.datasets[0].data;
                function totalSum(total, datapoint) {
                  return total + datapoint;
                }
                const totalvalue = datapoints.reduce(totalSum, 0);
                const porcentageValue = (value / totalvalue * 100).toFixed(1);
                const display = [`Cant:${value}`, `${porcentageValue}%`]
                return display;
              }
            }
          }
        },
        plugins: [ChartDataLabels]
    });
  }

}
