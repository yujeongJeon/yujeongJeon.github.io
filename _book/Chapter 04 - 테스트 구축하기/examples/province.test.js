const chai = require("chai");
const expect = chai.expect;
const {createProvince, sampleProvinceData} = require('./province')

describe('province', () => { // (1)
    let asia
    beforeEach(() => {
        asia = createProvince(sampleProvinceData())
    })
    it('shortfall', () => {
        expect(asia.shortfall).to.equal(5)
    })

    it('profit', () => {
        expect(asia.profit).to.equal(230)
    })

    it('change production', () => {
        // when
        asia.producers[0].production = 20

        // expect
        expect(asia.shortfall).to.equal(-6)
        expect(asia.profit).to.equal(292)
    })

    it('zero demand', () => {
        asia.demand = 0
        expect(asia.shortfall).to.equal(-25)
        expect(asia.profit).to.equal(0)
    })

    it('negative demand', () => {
        asia.demand = -1
        expect(asia.shortfall).to.equal(-26)
        expect(asia.profit).to.equal(-10)
    })

    it('empty string demand', () => {
        asia.demand = ""
        expect(asia.shortfall).NaN
        expect(asia.profit).NaN
    })
})

describe('no producers', () => { // (2)
    let noProducers

    beforeEach(() => {
        const data = {
            name: "No Producers",
            producers: [],
            demand: 30,
            price: 20
        }
        noProducers = createProvince(data)
    })

    it('shortfall', () => {
        expect(noProducers.shortfall).to.equal(30)
    })

    it('profit', () => {
        expect(noProducers.profit).to.equal(0)
    })
})

describe('string for producers', () => { // (3)
    it('', () => {
        const data = {
            name: "String producers",
            producers: "",
            demand: 30,
            price: 20
        }
        const prov = createProvince(data)
        expect(prov.shortfall).to.equal(0)
    })
})