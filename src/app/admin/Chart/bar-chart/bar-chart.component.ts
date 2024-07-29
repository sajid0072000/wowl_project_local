import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, OnChanges {

  public barChartData: any = {};
  public barChartLegend = true;
  public barChartPlugins = [];

  data: any = [];
  labels: any = [];
  label: any = '';
  xAxisText: any = '';
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
  };

  @Input() barchart: any = [];
  @Input() title: any = '';
  // @Input() piechart:any = '';

  constructor(private common: CommonService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.barchart) {
      for (let item of this.barchart) {
        this.data.push(item.value);
        this.labels.push(item.label);
      }
      this.createBarChart()
    }
  }

  ngOnInit(): void {

    // setTimeout(() => {

    // }, 1000);
  }

  createBarChart() {
    this.barChartData = {
      labels: this.labels,
      datasets: [
        {
          data: this.data,
          label: 'Count',
          fill: true,
          barPercentage: 0.5
        },
      ]
    };
    this.barChartOptions = {
      responsive:true,
      maintainAspectRatio: false,
      backgroundColor:'#065EAD',
      
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        x: {
          title: { display: true, text: this.xAxisText },
        },
        y: {
          title: { display: true, text: 'Course Count' },
        }
      },
     
    };
  }

}
