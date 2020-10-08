const SME_ALERT_CODE = {
    APPROVAL_EXPIRED: 'APPROVAL_EXPIRED',
    NOT_MATCH_LOGIN_INFO: 'NOT_MATCH_LOGIN_INFO'
}

const VALID_CODE = {
    '0': 'normal',
    '1': 'error',
    '2': 'expired',
    '3': 'different'
}

// :( old
const getLoanInfo = async (encryptParam) => {
    const {validationCode} = await checkValidation({encryptParam})
    const validCode = VALID_CODE[validationCode]

    // 유효하지 않은 validCode 처리
    // NF관리번호 오류
    if (validCode === 'error') {
        goMain()
    }
    // 대출진행정보 만료
    else if (validCode === 'expired') {
        showAlert(SME_ALERT_CODE.APPROVAL_EXPIRED)
    }
    // 명의 불일치
    else if (validCode === 'different') {
        showAlert(SME_ALERT_CODE.NOT_MATCH_LOGIN_INFO)
    }
}


// :) good
// 6.5 함수 선언 바꾸기
const nfValidation = async (encryptParam) => {
    const {validationCode} = await checkValidation({encryptParam})
    handleInvalid(VALID_CODE[validationCode])
}

const handleInvalid = (validCode) => {
    if (validCode === 'error') {
        goMain()
    }
    else if (validCode === 'expired') {
        showAlert(SME_ALERT_CODE.APPROVAL_EXPIRED)
    }
    else if (validCode === 'different') {
        showAlert(SME_ALERT_CODE.NOT_MATCH_LOGIN_INFO)
    }
}