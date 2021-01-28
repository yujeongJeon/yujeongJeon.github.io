const {createProducer} = require('./producer')

class Province {
    constructor (doc) {
        this._name = doc._name
        this._producers = []
        this._totalProduction = 0
        this._demand = doc.demand
        this._price = doc.price
        doc.producers.forEach(d => this.addProducer(createProducer(this, d)))
    }

    get name() {return this._name}
    get producers() {return this._producers}
    get totalProduction() {return this._totalProduction}
    set totalProduction(arg) {this._totalProduction = arg}
    get demand() {return this._demand}
    set demand(arg) {this._demand = parseInt(arg)}
    get price() {return this._price}
    set price(arg) {this._price = parseInt(arg)}

    addProducer (arg) {
        this._producers.push(arg)
        this._totalProduction += arg.production
    }

    get shortfall() {
        return this._demand - this.totalProduction
    }

    get profit() {return this.demandValue - this.demandCost}

    get demandValue() {return this.satisfiedDemand * this.price}

    get satisfiedDemand() {return Math.min(this._demand, this.totalProduction)}

    get demandCost() {
        let remainingDemand = this.demand
        let result = 0
        this.producers
            .sort((a, b) => a.cost - b.cost)
            .forEach(p => {
                const contribution = Math.min(remainingDemand, p.production)
                remainingDemand -= contribution
                result += contribution * p.cost
            })
        return result
    }
}

module.exports = {
    sampleProvinceData: () => ({
        name: "Asia",
        producers: [,
            {name: "Byzantium", cost: 10, production: 9},
            {name: "Attalia", cost: 12, production: 10},
            {name: "Sinope", cost: 10, production: 6}
        ],
        demand: 30,
        price: 20
    }),
    createProvince: (doc) => {
        return new Province(doc)
    }
}