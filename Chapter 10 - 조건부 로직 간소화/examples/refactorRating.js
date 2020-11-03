// 10.4 예제 코드 리펙토링

class Rating {
    constructor(voyage, history) {
        this.voyage = voyage
        this.history = history
    }

    get hasChinaHistory() {
        return this.history.some((v) => v.zone === '중국')
    }

    get voyageAndHistoryLengthFactor(){
        let result = 0
        if (this.history.length > 8) {
            result += 1
        }
        if (this.voyage.length > 14) {
            result -= 1
        }
        return result
    }

    get voyageProfileFactor() {
        let result = 2
        if (this.voyage.zone === '중국') {
            result += 1
        }
        if (this.voyage.zone === '동인도') {
            result += 1
        }
        result += this.voyageAndHistoryLengthFactor
        return result
    }

    get voyageRisk() {
        let result = 1
        if (this.voyage.length > 4) {
            result += 2
        }
        if (this.voyage.length > 8) {
            result += this.voyage.length - 8
        }
        if (['중국', '동인도'].includes(this.voyage.zone)) {
            result += 4
        }
        return Math.max(result, 0)
    }

    get captainHistoryRist() {
        let result = 1
        if (this.history.length < 5) {
            result += 4
        }
        result += this.history.filter((v) => v.profit < 0).length
        return Math.max(result, 0)
    }

    get value() {
        const vpf = this.voyageProfileFactor
        const vr = this.voyageRisk
        const chr = this.captainHistoryRist
        if (vpf * 3 > vr + chr * 2) {
            return 'A'
        }
        return 'B'
    }
}

class ExperiencedChinaRating extends Rating {
    get captainHistoryRist() {
        const result = super.captainHistoryRist - 2
        return Math.max(result, 0)
    }
    get voyageAndHistoryLengthFactor(){
        let result = 0
        result += 3
        if (this.history.length > 10) {
            result += 1
        }
        if (this.voyage.length > 12) {
            result += 1
        }
        if (this.voyage.length > 18) {
            result -= 1
        }
        return result
    }
}

function createRating(voyage, history) {
    if(voyage.zone === '중국' && history.some((v) => v.zone === '중국')){
        return new ExperiencedChinaRating()
    } else {
        return new Rating(voyage, history)
    }
}

function rating(voyage, history) {
    return createRating(voyage, history)
}
