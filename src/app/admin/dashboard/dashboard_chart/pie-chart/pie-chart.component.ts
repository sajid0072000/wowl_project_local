import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit, OnChanges {

  public pieChartOptions: ChartOptions<'pie'> = {
  };
  public pieChartLegend = false;
  public pieChartPlugins = [];
  public pieChartData: any = [];
  public dynHeight = 300;
  // backgroundColor:any = ['#083B6A ' ,"#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b",]
  backgroundColor: any = [];
  data: any = [];
  labels: any = [];
  @Input() piechart: any = [];
  @Input() title: any = '';

  constructor(private common: CommonService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.piechart) {
      this.data = [];
      this.labels = [];
      for (let item of this.piechart) {
        this.labels.push(item.label);
        this.data.push(item.value);
      }
      this.createChart();
    }
  }

  ngOnInit(): void {
  }

  // createColor() {
  //   var r = Math.floor(Math.random() * 255);
  //   var g = Math.floor(Math.random() * 255);
  //   var b = Math.floor(Math.random() * 255);
  //   r = (r + Math.floor(Math.random() * 100)) % 256;
  //   g = (g + Math.floor(Math.random() * 100)) % 256;
  //   b = (b + Math.floor(Math.random() * 100)) % 256;
  //   return "rgb(" + r + "," + g + "," + b + ")";
  // }
  createChart() {
    this.pieChartData = {
      labels: this.labels,
      datasets: [
        {
          data: this.data,
          backgroundcolor:'fill',
          labels: '',
          hoverOffset:10
        }
      ]
    };
    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    }
  }
}
