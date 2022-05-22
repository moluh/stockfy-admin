import { ChartOptions, ChartDataSets, ChartType } from 'chart.js'
import { Color, Label } from 'ng2-charts'

export class ArraysGraphics {
    public barChartOptions: ChartOptions = {
        responsive: true,
    }
    public barChartType: ChartType = 'bar'
    public barChartLegend = true
    public barChartPlugins = []
    public lineChartOptions: ChartOptions = {
        responsive: true,
    }
    public lineChartColors: Color[] = [
        {
            borderColor: 'black',
            backgroundColor: 'rgba(255,0,0,0.3)',
        },
    ]
    public lineChartLegend = true
    public lineChartType = 'line'
    public lineChartPlugins = []

    // LABELS
    public lineLabelsCountMovimientos: Label[] = []
    public lineLabelsCountPagos: Label[] = []
    public lineLabelsGanancias: Label[] = []
    public lineLabelsTotalDePagos: Label[] = []
    public lineLabelsTotalVendido: Label[] = []
    public barLabelsCountMovimientos: Label[] = []
    public barLabelsCountPagos: Label[] = []
    public barLabelsGanancias: Label[] = []
    public barLabelsTotalDePagos: Label[] = []
    public barLabelsTotalVendido: Label[] = []
    // DATA
    public lineDataCountMovimientos: ChartDataSets[] = [
        {
            data: [],
            label: 'Cantidad de ventas',
            backgroundColor: this.randomHexColor(),
            hoverBackgroundColor: this.randomHexColor(),
        },
    ]
    public lineDataCountPagos: ChartDataSets[] = [
        {
            data: [],
            label: 'Cantidad de pagos',
            backgroundColor: this.randomHexColor(),
            hoverBackgroundColor: this.randomHexColor(),
        },
    ]
    public lineDataGanancias: ChartDataSets[] = [
        {
            data: [],
            label: 'Ganancias por intereses',
            backgroundColor: this.randomHexColor(),
            hoverBackgroundColor: this.randomHexColor(),
        },
    ]
    public lineDataTotalDePagos: ChartDataSets[] = [
        {
            data: [],
            label: 'Monto total de pagos',
            backgroundColor: this.randomHexColor(),
            hoverBackgroundColor: this.randomHexColor(),
        },
    ]
    public lineDataTotalVendido: ChartDataSets[] = [
        {
            data: [],
            label: 'Monto total vendido',
            backgroundColor: this.randomHexColor(),
            hoverBackgroundColor: this.randomHexColor(),
        },
    ]
    public barDataCountMovimientos: ChartDataSets[] = [
        {
            data: [],
            label: 'Cantidad de ventas',
            backgroundColor: this.randomHexColor(),
            hoverBackgroundColor: this.randomHexColor(),
        },
    ]
    public barDataCountPagos: ChartDataSets[] = [
        {
            data: [],
            label: 'Cantidad de ventas',
            backgroundColor: this.randomHexColor(),
            hoverBackgroundColor: this.randomHexColor(),
        },
    ]
    public barDataGanancias: ChartDataSets[] = [
        {
            data: [],
            label: 'Ganancias por intereses',
            backgroundColor: this.randomHexColor(),
            hoverBackgroundColor: this.randomHexColor(),
        },
    ]
    public barDataTotalDePagos: ChartDataSets[] = [
        {
            data: [],
            label: 'Monto total de pagos',
            backgroundColor: this.randomHexColor(),
            hoverBackgroundColor: this.randomHexColor(),
        },
    ]
    public barDataTotalVendido: ChartDataSets[] = [
        {
            data: [],
            label: 'Monto total vendido',
            backgroundColor: this.randomHexColor(),
            hoverBackgroundColor: this.randomHexColor(),
        },
    ]

    public resetData() {
        // LABELS
        this.lineLabelsCountMovimientos = []
        this.lineLabelsCountPagos = []
        this.lineLabelsGanancias = []
        this.lineLabelsTotalDePagos = []
        this.lineLabelsTotalVendido = []
        // DATA
        this.lineDataCountMovimientos = [
            {
                data: [],
                label: 'Cantidad de ventas',
                backgroundColor: this.randomHexColor(),
                hoverBackgroundColor: this.randomHexColor(),
            },
        ]
        this.lineDataCountPagos = [
            {
                data: [],
                label: 'Cantidad de pagos',
                backgroundColor: this.randomHexColor(),
                hoverBackgroundColor: this.randomHexColor(),
            },
        ]
        this.lineDataGanancias = [
            {
                data: [],
                label: 'Ganancias por intereses',
                backgroundColor: this.randomHexColor(),
                hoverBackgroundColor: this.randomHexColor(),
            },
        ]
        this.lineDataTotalDePagos = [
            {
                data: [],
                label: 'Monto total de pagos',
                backgroundColor: this.randomHexColor(),
                hoverBackgroundColor: this.randomHexColor(),
            },
        ]
        this.lineDataTotalVendido = [
            {
                data: [],
                label: 'Monto total vendido',
                backgroundColor: this.randomHexColor(),
                hoverBackgroundColor: this.randomHexColor(),
            },
        ]
        // LABELS
        this.barLabelsCountMovimientos = []
        this.barLabelsCountPagos = []
        this.barLabelsGanancias = []
        this.barLabelsTotalDePagos = []
        this.barLabelsTotalVendido = []
        // DATA
        this.barDataCountMovimientos = [
            {
                data: [],
                label: 'Cantidad de ventas',
                backgroundColor: this.randomHexColor(),
                hoverBackgroundColor: this.randomHexColor(),
            },
        ]
        this.barDataCountPagos = [
            {
                data: [],
                label: 'Cantidad de ventas',
                backgroundColor: this.randomHexColor(),
                hoverBackgroundColor: this.randomHexColor(),
            },
        ]
        this.barDataGanancias = [
            {
                data: [],
                label: 'Ganancias por intereses',
                backgroundColor: this.randomHexColor(),
                hoverBackgroundColor: this.randomHexColor(),
            },
        ]
        this.barDataTotalDePagos = [
            {
                data: [],
                label: 'Monto total de pagos',
                backgroundColor: this.randomHexColor(),
                hoverBackgroundColor: this.randomHexColor(),
            },
        ]
        this.barDataTotalVendido = [
            {
                data: [],
                label: 'Monto total vendido',
                backgroundColor: this.randomHexColor(),
                hoverBackgroundColor: this.randomHexColor(),
            },
        ]
    }

    randomHexColor() {
        const random = '#' + Math.floor(Math.random() * 16777215).toString(16)
        return random
    }
}
