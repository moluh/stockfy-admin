import { Component, OnInit } from '@angular/core'
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js'
import { Color, Label } from 'ng2-charts'
import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import { StatisticsService } from 'src/app/services/statistics.service'
dayjs.extend(utc)
import { ArraysGraphics } from './arraysGraphics'

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
    ag: ArraysGraphics = new ArraysGraphics()
    title: string = 'Estadísticas'
    statisticsDashboard: any = null
    statisticsGraphic: any = null
    styleGraphic: string = 'bar'
    fromDashboard: any = dayjs().startOf('month').format('YYYY-MM-DD')
    toDashboard: any = dayjs().endOf('month').format('YYYY-MM-DD')
    fromGraphic: any = dayjs().startOf('month').format('YYYY-MM-DD')
    toGraphic: any = dayjs().endOf('month').format('YYYY-MM-DD')

    lineChartOptions: ChartOptions = this.ag.lineChartOptions
    lineChartColors: Color[] = this.ag.lineChartColors
    lineChartLegend = this.ag.lineChartLegend
    lineChartType = this.ag.lineChartType
    lineChartPlugins = this.ag.lineChartPlugins

    barChartOptions: ChartOptions = this.ag.barChartOptions
    barChartType: ChartType = this.ag.barChartType
    barChartLegend = this.ag.barChartLegend
    barChartPlugins = this.ag.barChartPlugins

    lineLabelsCountMovimientos: Label[] = this.ag.lineLabelsCountMovimientos
    lineLabelsCountPagos: Label[] = this.ag.lineLabelsCountPagos
    lineLabelsGanancias: Label[] = this.ag.lineLabelsGanancias
    lineLabelsTotalDePagos: Label[] = this.ag.lineLabelsTotalDePagos
    lineLabelsTotalVendido: Label[] = this.ag.lineLabelsTotalVendido

    barLabelsCountMovimientos: Label[] = this.ag.barLabelsCountMovimientos
    barLabelsCountPagos: Label[] = this.ag.barLabelsCountPagos
    barLabelsGanancias: Label[] = this.ag.barLabelsGanancias
    barLabelsTotalDePagos: Label[] = this.ag.barLabelsTotalDePagos
    barLabelsTotalVendido: Label[] = this.ag.barLabelsTotalVendido

    lineDataCountMovimientos: ChartDataSets[] = this.ag.lineDataCountMovimientos
    lineDataCountPagos: ChartDataSets[] = this.ag.lineDataCountPagos
    lineDataGanancias: ChartDataSets[] = this.ag.lineDataGanancias
    lineDataTotalDePagos: ChartDataSets[] = this.ag.lineDataTotalDePagos
    lineDataTotalVendido: ChartDataSets[] = this.ag.lineDataTotalVendido

    barDataCountMovimientos: ChartDataSets[] = this.ag.barDataCountMovimientos
    barDataCountPagos: ChartDataSets[] = this.ag.barDataCountPagos
    barDataGanancias: ChartDataSets[] = this.ag.barDataGanancias
    barDataTotalDePagos: ChartDataSets[] = this.ag.barDataTotalDePagos
    barDataTotalVendido: ChartDataSets[] = this.ag.barDataTotalVendido

    constructor(private _stats: StatisticsService) {}

    ngOnInit(): void {}

    changeStyleGraphic() {
        this.styleGraphic = this.styleGraphic === 'bar' ? 'line' : 'bar'
    }

    getStatsDashboard() {
        this._stats
            .getBetweenDatesDashboard(this.fromDashboard, this.toDashboard)
            .subscribe((data) => {
                this.statisticsDashboard = data
            })
    }

    getStatsGraphics() {
        this.resetData()
        this._stats
            .getBetweenDatesGraphic(this.fromGraphic, this.toGraphic)
            .subscribe((data) => {
                this.setGraphicData(data)
            })
    }

    setGraphicData(data) {
        data.map((stat) => {
            this.lineLabelsCountMovimientos.push(
                dayjs(stat.Fecha).format('DD-MMM')
            )
            this.lineLabelsCountPagos.push(dayjs(stat.Fecha).format('DD-MMM'))
            this.lineLabelsGanancias.push(dayjs(stat.Fecha).format('DD-MMM'))
            this.lineLabelsTotalDePagos.push(dayjs(stat.Fecha).format('DD-MMM'))
            this.lineLabelsTotalVendido.push(dayjs(stat.Fecha).format('DD-MMM'))

            this.lineDataCountMovimientos[0].data.push(
                parseInt(stat.CountMovimientos)
            )
            this.lineDataCountPagos[0].data.push(parseInt(stat.CountPagos))
            this.lineDataGanancias[0].data.push(stat.Ganancias)
            this.lineDataTotalDePagos[0].data.push(stat.TotalDePagos)
            this.lineDataTotalVendido[0].data.push(stat.TotalVendido)

            this.barLabelsCountMovimientos.push(
                dayjs(stat.Fecha).format('DD-MMM')
            )
            this.barLabelsCountPagos.push(dayjs(stat.Fecha).format('DD-MMM'))
            this.barLabelsGanancias.push(dayjs(stat.Fecha).format('DD-MMM'))
            this.barLabelsTotalDePagos.push(dayjs(stat.Fecha).format('DD-MMM'))
            this.barLabelsTotalVendido.push(dayjs(stat.Fecha).format('DD-MMM'))

            this.barDataCountMovimientos[0].data.push(
                parseInt(stat.CountMovimientos)
            )
            this.barDataCountPagos[0].data.push(parseInt(stat.CountPagos))
            this.barDataGanancias[0].data.push(stat.Ganancias)
            this.barDataTotalDePagos[0].data.push(stat.TotalDePagos)
            this.barDataTotalVendido[0].data.push(stat.TotalVendido)
        })
        this.statisticsGraphic = data
    }

    resetData() {
        const nag = new ArraysGraphics()
        nag.resetData()
        this.lineChartOptions = nag.lineChartOptions
        this.lineChartColors = nag.lineChartColors
        this.lineChartLegend = nag.lineChartLegend
        this.lineChartType = nag.lineChartType
        this.lineChartPlugins = nag.lineChartPlugins

        this.barChartOptions = nag.barChartOptions
        this.barChartType = nag.barChartType
        this.barChartLegend = nag.barChartLegend
        this.barChartPlugins = nag.barChartPlugins

        this.lineLabelsCountMovimientos = nag.lineLabelsCountMovimientos
        this.lineLabelsCountPagos = nag.lineLabelsCountPagos
        this.lineLabelsGanancias = nag.lineLabelsGanancias
        this.lineLabelsTotalDePagos = nag.lineLabelsTotalDePagos
        this.lineLabelsTotalVendido = nag.lineLabelsTotalVendido

        this.barLabelsCountMovimientos = nag.barLabelsCountMovimientos
        this.barLabelsCountPagos = nag.barLabelsCountPagos
        this.barLabelsGanancias = nag.barLabelsGanancias
        this.barLabelsTotalDePagos = nag.barLabelsTotalDePagos
        this.barLabelsTotalVendido = nag.barLabelsTotalVendido

        this.lineDataCountMovimientos = nag.lineDataCountMovimientos
        this.lineDataCountPagos = nag.lineDataCountPagos
        this.lineDataGanancias = nag.lineDataGanancias
        this.lineDataTotalDePagos = nag.lineDataTotalDePagos
        this.lineDataTotalVendido = nag.lineDataTotalVendido

        this.barDataCountMovimientos = nag.barDataCountMovimientos
        this.barDataCountPagos = nag.barDataCountPagos
        this.barDataGanancias = nag.barDataGanancias
        this.barDataTotalDePagos = nag.barDataTotalDePagos
        this.barDataTotalVendido = nag.barDataTotalVendido
    }
}
