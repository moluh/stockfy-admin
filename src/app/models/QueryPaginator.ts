export class QueryPaginator {
    pageSize: number
    pageNro: number
    attribute?: string
    text?: string
    role?: string
    isActive?: boolean
    isArchive?: boolean

    constructor() {
        this.pageNro = 0
        this.pageSize = 10
        this.attribute = ''
        this.text = ''
        this.role = ''
        this.isActive = true
        this.isArchive = true
    }
}
