/**
 * @example 예시 1
 */
const pad2digit = digit => digit.length >= 2 ? digit : `0${digit}`

// :(
const timerFormat = value => `${pad2digit(`${parseInt(value / 60)}`)}:${pad2digit(`${value % 60}`)}`

// :)
const timerFormat = value => {
    const _minutes = parseInt(value / 60)
    const minutes = pad2digit(`${_minutes}`)
    const seconds = pad2digit(`${value % 60}`)

    return `${minutes}:${seconds}`
}


/**
 * @example 예시 2
 */

// :(
const showExitAlert = useCallback(() => {
    const exitAlertCode = step === '4' ? SME_ALERT_CODE.EXIT.SAVE : SME_ALERT_CODE.EXIT.NOT_SAVE
    showAlert(exitAlertCode)
}, [showAlert, step])

const isValidReferer = useCallback(() => {
    switch (step) {
        case '4':
            return isSurlEnter(query)
        default:
            return isHomeEnter
    }
}, [isHomeEnter, isSurlEnter, step, query])

// :)
const lastStep = step === '4'

const showExitAlert = () => {
    const exitAlertCode = lastStep ? SME_ALERT_CODE.EXIT.SAVE : SME_ALERT_CODE.EXIT.NOT_SAVE
    showAlert(exitAlertCode)
}

const isValidReferer = () => {
    return lastStep ? isSurlEnter(query) : isHomeEnter
}