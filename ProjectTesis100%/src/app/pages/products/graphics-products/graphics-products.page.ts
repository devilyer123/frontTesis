import { Component, OnInit } from '@angular/core';
import Chart from "chart.js/auto";
import { listProdGrap, Order, Product } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';
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

  private productChart: Chart;

  constructor(private dataService: DataService,
    private orderService: OrderService) { }

  ngOnInit() {
    this.loadProductsAndOrders();
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

  loadDataGraphic() {
    for(let i = 0; i < this.products.length; i++) {
      this.total = 0;
      for(let x = 0; x < this.orders.length; x++) {
        if (this.products[i].idpro == this.orders[x].proId)
        {
          this.total = this.total + this.orders[x].cantSolic;
        }
      }
      this.listDataGrap[i] = {
        nomPro: this.products[i].nomProd,
        cantVend: this.total
      }
    }
    this.generateCharts();
  }

  generateCharts() {
    console.log(this.listDataGrap);
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
        type: 'bar',
        data: {
            labels: this.listDataGrap.map(m => m.nomPro),
            datasets: [{
                data: this.listDataGrap.map(m => m.cantVend),
                backgroundColor: graphicColors,
                borderColor: graphicColors,
                borderWidth: 1
            }]
        },
        options: {
        }
    });
  }

}
