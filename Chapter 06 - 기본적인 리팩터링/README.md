# Chapter 06. 기본적인 리팩터링
### 리팩터링 목록

모든 절차 마지막에는 반드시 테스트를 수행합니다.

| 리팩터링명                   | 개요                                                         | 절차                                                         | 예시                                                       |
| ---------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ---------------------------------------------------------- |
| 함수 추출하기                | 목적과 구현에 따른 함수 분리                                 | 1. 함수의 **목적**을 드러내는 이름을 붙임<br />2. 추출할 코드를 새 함수에 복사<br />3. 참조하는 지역변수는 인수로 전달<br />- 새 함수에서만 사용되는 변수는 지역변수로<br />- 지역변수의 값을 변경할 경우 새 함수의 결과로 전달<br />4. 새로 만든 함수를 호출하는 문으로 수정 | [6.1 예시 코드](./examples/61-extractFunction.js)          |
| 함수 인라인하기              | 본문 코드가 함수명만큼이나 명확하거나<br />간접 호출이 과하게 많을 경우 사용 | 1. 서브 클래스에서 오버라이딩된 메서드인지 체크<br />- 오버라이딩된 메서드는 인라인 금지<br />2. 모든 호출문을 (점진적으로) 인라인으로 교체 | [6.2 예시 코드](#user-content-62-함수-인라인하기)          |
| 변수 추출하기                | 복잡한 로직을 구성하는 단계마다 변수로 이름 붙이기<br />디버깅 시 break point 설정 용이<br /><br />(주의) 문맥을 고려하여 현재 선언된 함수보다<br />더 넓은 문맥에서까지 의미가 된다면 <br />함수로 추출하는 것을 권장 | 1. 추출할 표현식에 사이드이펙트가 없는지 확인<br />2. 상수를 하나 선언 후 표현식 대입<br />3. 새로 만든 변수로 교체 | [6.3 예시 코드](./examples/63-extractVariable.js)          |
| 변수 인라인하기              | 변수명이 원래 표현식과 다를바 없을 때                        | 1. 인라인할 표현식에 사이드이펙트가 없는지 확인<br />2. 상수인지 확인하고 상수로 수정 후 테스트<br />- 변수에 값이 단 한번만 대입되는지 확인<br />3. 변수를 표현식으로 교체 | [6.4 예시 코드](#user-content-64-변수-인라인하기)          |
| 함수 선언 바꾸기             | 이름이 잘못된 함수를 발견 즉시 수정<br />주석이 좋은 이름을 짓는데 도움이 됨<br /><br />마이그레이션 절차의 복잡도에 따라 <br />**간단한 절차**와 **마이그레이션 절차**로 구분지어 따름 | **간단한 절차**<br />1. 매개변수 제거 시, 참조하는 곳이 있는지 확인<br />2. 메서드 선언 변경( VSCode에서 ```f2 ``` )<br /><br />**마이그레이션 절차**<br />1. 함수 본문을 새 함수로 추출<br />2. 새 함수에 인자 추가 시 간단한 절차로 추가<br />3. 테스트<br />- assertion 추가로 실제로 사용하는지 검사 가능<br />- *Q. 매개변수 기본값으로 초기화하면 안되려나?*<br />4. 기존 함수가 새 함수를 호출하도록 전달 함수로 수정<br /><br />5. 예전 함수를 쓰는 코드를 새 함수를 호출하도록 수정<br />6. 임시 이름을 붙인 새 함수를 원래 이름으로 수정 | [6.5 예시 코드](#user-content-65-함수-선언-바꾸기)         |
| 변수 캡슐화하기              | 접근 범위가 넓은 데이터를 그 데이터로의 접근을 독점하는 함수로 캡슐화<br />- 추가 로직을 쉽게 끼워넣을 수 있음<br />불변 데이터는 변경될 일이 없기 때문에 캡슐화 불필요 | 1. 변수의 접근과 갱신을 전담하는 함수 선언<br />2. 정적 검사 수행<br />3. 변수에 직접 참조하던 부분을 모두 캡슐화 함수 호출로 수정<br />4. 수정할 때마다 테스트<br />5. 변수의 접근 범위를 제한<br />- 같은 모듈로 옮기고 접근함수만 export<br />6. 테스트<br />7. 원본 데이터의 변경이 필요할 때<br />- getter에서 데이터 복제 후 전달<br />- 레코드 캡슐화하기 (클레스로 감싸기)<br /><br />(**주의**) nested object일 경우 불충분할 수 있음 | [6.6 예시 코드](./examples/66-encapsulateVariable.js)      |
| 변수 이름 바꾸기             | 값이 영속적인 필드의 이름은 신중하게 짓기                    | 1. 넓은 범위에서 쓰이는 변수는 **변수 캡슐화하기** 고려<br />2. 이름 바꿀 변수를 참조하는 곳을 찾아서 하나씩 변경 | [6.7 예시 코드](#user-content-67-변수-이름-바꾸기)         |
| 매개변수 객체 만들기         | 데이터 뭉치를 데이터 구조로 묶기<br />- 이 데이터 구조가 문제 영역을 간결하게 나타내는<br />추상 영역으로 간주되어 코드의 개념적인 그림을 다시 설계할 수 있음 | 1. 데이터 구조 생성<br />- 클래스 선호 ([값 객체](https://www.martinfowler.com/bliki/ValueObject.html))<br />2. 테스트<br />3. 함수 선언 바꾸기로 새 데이터 구조를 인자로 추가<br />4. 테스트<br />5. 함수 호출하는 곳에서 새 데이터 구조를 인자로 넘기도록 수정<br />6. 기존 매개변수 제거 | [6.8 예시 코드](./examples/68-introduceParameterObject.js) |
| 여러 함수를 클래스로 묶기    |                                                              |                                                              |                                                            |
| 여러 함수를 변환 함수로 묶기 |                                                              |                                                              |                                                            |
| 단계 쪼개기                  |                                                              |                                                              |                                                            |



### 간단한 예시 코드

짧은 예시들만을 작성하였으며 긴 예시 코드는 ```/examples``` 에 작성하였습니다.

#### 6.2 함수 인라인하기

```javascript
// :(
const isLastStep = step => step === '4'

const showExitAlert = () => {
    const exitAlertCode = isLastStep(step) ? SME_ALERT_CODE.EXIT.SAVE : SME_ALERT_CODE.EXIT.NOT_SAVE
    showAlert(exitAlertCode)
}

// :)
const showExitAlert = () => {
    const exitAlertCode = step === '4' ? SME_ALERT_CODE.EXIT.SAVE : SME_ALERT_CODE.EXIT.NOT_SAVE
    showAlert(exitAlertCode)
}
```



#### 6.4 변수 인라인하기

```javascript
// :(
const isEnd = next > -1
return isEnd

// :)
return next > -1
```



#### 6.5 함수 선언 바꾸기

```javascript
// :(
// 암호화 파라미터로 유효성 검사 !== getLoanInfo
const getLoanInfo = async (encryptParam) => {
  const {validationCode} = await checkValidation({encryptParam})
  handleInvalid(VALID_CODE[validationCode])
}

// :)
// 호출되는 곳이 없으면 제거
const getLoanInfo = async (encryptParam) => await nfValidation(encryptParam)

const nfValidation = async (encryptParam) => {
  const {validationCode} = await checkValidation({encryptParam})
  handleInvalid(VALID_CODE[validationCode])
}
```



#### 6.7 변수 이름 바꾸기

```javascript
// :(
const a = width * height

// :)
const area = width * height
```

