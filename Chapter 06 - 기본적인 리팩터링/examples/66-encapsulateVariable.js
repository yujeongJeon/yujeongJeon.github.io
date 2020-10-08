let defaultAgreements = [
    {
        id: 'prvsNum1',
        isRequired: true,
        label: '주민등록번호 수집, 이용 및 제공 동의',
        subList: null,
        link: '/#',
        isChecked: false,
        category: AGREEMENT_CATEGORY.MAC
    },
    {
        id: 'prvsNum2',
        isRequired: true,
        label: '온라인서비스 이용약관 동의',
        subList: null,
        link: '/#',
        isChecked: false,
        category: AGREEMENT_CATEGORY.MAC
    },
    {
        id: 'prvsNum3',
        isRequired: true,
        label: '여신거래 기본약관 동의',
        subList: null,
        link: '/#',
        isChecked: false,
        category: AGREEMENT_CATEGORY.MAC
    },
    {
        id: 'prvsNum4',
        isRequired: true,
        label: '전자금융 기본약관 동의',
        subList: null,
        link: '/#',
        isChecked: false,
        category: AGREEMENT_CATEGORY.MAC
    },
    {
        id: 'prvsNum5',
        isRequired: true,
        label: '개인정보 수집 및 이용 동의',
        subList: null,
        link: '/#',
        isChecked: false,
        category: AGREEMENT_CATEGORY.MAC
    },
    {
        id: 'prvsNum6',
        isRequired: true,
        label: '자동이체약관 동의',
        subList: null,
        link: '/#',
        isChecked: false,
        category: AGREEMENT_CATEGORY.MAC
    },
    {
        id: 'prvsNum7',
        isRequired: true,
        label: '개인정보 조회 동의',
        subList: null,
        link: '/#',
        isChecked: false,
        category: AGREEMENT_CATEGORY.MAC
    }
]

// :(
class Agreements {
    constructor() {
        this._agreements = defaultAgreements
    }

    get agreements() {return this._agreements}
    setAgreements(arg) {this._agreements = arg}

    // 약관 하나 체크
    handleAgreementChange(id) {
        this.agreements.some((item) => {
            if (item.id === id) {
                item.isChecked = !item.isChecked
            }
            return item.id === id
        })
    }

    // 약관 전체 동의
    handleAgreementAllChange() {
        this.agreements.forEach((item) => {
            item.isChecked = true
        })
    }
}

// :)
const agreements = () => cloneDeep(defaultAgreements)

class Agreements {
    constructor() {
        this._agreements = agreements()
    }

    get agreements() {return this._agreements}
    setAgreements(arg) {this._agreements = arg}

    // 약관 하나 체크
    handleAgreementChange(id) {
        this.agreements.some((item) => {
            if (item.id === id) {
                item.isChecked = !item.isChecked
            }
            return item.id === id
        })
    }

    // 약관 전체 동의
    handleAgreementAllChange() {
        const nextList = this.agreements.map((item) => {
            item.isChecked = true
            return item
        })
        this.setAgreements(nextList)
    }
}