# Chapter 11 - API 리팩터링

1. 질의 함수와 변경 함수 분리하기

> 우리는 순수함수를 추구해야 한다.
  
  질의 함수에서 부수효과를 제거한다

```
// 1. 사이드 이팩트가 있는 함수
function fn(){
 for(name in list){
    if(name === '박태희'){
      alert(name)
    }
  }
}

// 2. 사이드 이팩트를 없애보자
function findTaehyun(people){
 for(name in people){
    if(name === '박태희'){
      return name
    }
  }
}
let name = find()
alert(name)
```

<br>
2. 함수 매개변수화하기

> 두 함수의 로직이 아주 비슷하다면 다른 값만 매개변수로 받아 처리하는 함수 하나로 합치자.
  
  ```
  function tenPercentRaise(aPerson){
    aPerson.selary = aPerson.salary.multiply(1.1)
  }

  function fivePercentRaise(aPerson){
    aPerson.selary = aPerson.salary.multiply(1.1)
  }


  // 1. 두 함수가 비슷하다.
  // 2. 함수 하나를 잡아서 매개변수를 추가한다.
  function tenPercentRaise(aPerson, percent){
    aPerson.selary = aPerson.salary.multiply(1.1)
  }
  // 3. 함수 이름을 적절하게 지어주고 파라미터를 사용하자 
  function raise(aPerson, percent){
    aPerson.selary = aPerson.salary.multiply(percent)
  }
  ```
+@ 방탄코드가 설령 필요 없더라도, 대처 방식을 설명해주므로 그냥 두기도 한 점 

<br>
  3. 플래그 인수 제거하기

   > 함수를 호출하면서 플래그 기능을 하는 매개변수가 있다면, 이를 제거하자.

```
function getCar(type, value){
   if(type === 'special'){
     // blah~
   }
   if(type === 'ordinary'){
    // blah~
   }
}

// 1. type이라는 플래그 역할을 하는 매개변수가 있다.
// 2. 아예 함수를 나누자 

getSpecialCar()
getOrdinaryCar()

// 3. 호출 자체에 의미를 담을 수 있게 된다.
```
<br>
  4. 객체 통째로 넘기기

  > 하나의 레코드에서 여러 값을 가져와 함수 호출 인자로 넘긴다면 그냥 레코드를 넘겨라
  
  > 만약 어떤 객체로부터 값 몇 개를 얻은 후 그 값들로만 무언가를 하는 로직이 있다면, 그 로직을 객체 안으로 집어 넣을 때가 된거다.

  > js의 경우 this를 넘기는 것도 방법

<br>
  5. 매개변수를 질의 함수로 바꾸기
   
  > 매개변수 목록은 함수의 변동 요인을 모아놓은 곳이다.

  > 피호출 함수가 스스로 쉽게 결정할 수 있는 값을 매개변수로 건네는 것도 일종의 중복이다.
  
  > 호출하는 쪽이 간단해 지느냐, 피호출 함수가 간단해 지느냐의 문제로 볼 수도 있다.
  

<br>
  6. 질의 함수를 매개변수로 바꾸기
   
  > 함수안에 두기에 부담스러운 참조는 매개변수로 받자.

- 함수 안에 두기에 거북한 친구를 발견할 때가 있다.
    - 전역 변수 참조
    - 제거하길 원하는 원소를 참조

- 바로 위 11.5절과 상반되는 내용이다. 즉, 적절하게 균형점을 찾아야 한다.

```
get parentName(){
  let person = user.person;
  return person.parent.name
}

get parentName(person){
  return person.parent.name
}
```

+@ props를 매개변수로 본다면?

<br>
  7. 세터 제거하기
   
  > 세터를 제거함으로서 해당 변수가 변경될 가능성이 없다는 것을 나타낼 수 있다.

```
get name(){return this._name}
set name(arg){this.name = arg}
get id(){return this._id}
set id(arg){this._id = arg}

const martin = new Person();
martin.name = '유정'
martin.id = 'newjeong'

// 1. id는 변경되면 안된다. 그러니 세터를 없애자.

// Person
constructor(id){
  this.id = id;

  get name(){return this._name}
  set name(arg){this.name = arg}
  get id(){return this._id}
  set id(arg){this._id = arg}
}

// 2. id는 생성자의 매개변수로 받는다.
const martin = new Person('newjeong');
martin.name = '유정'

// 3. set id(...){...} 지우자
```

<br />

#### 8. 생성자를 팩터리 함수로 바꾸기
<details>
<summary>개요 코드</summary>

```javascript

class Person() {
  constructor(name, age, gender) {
    this._name = name
    this._age = age
    this._gender = gender
  }

  get name() {
    return this._name
  }
  
  get age() {
    return this._age
  }

  changeName(newName) {
    this.name = newName
  }

  growOld() {
    this.age += 1
  }
}

const createPerson = (name, age, gender) => {
  return new Person(name, age, gender)
}

// 비권장
const woman = createPerson('Jane Doe', 20, 'F')
const man = createPerson('Sam Doe', 20, 'M')


// 권장
const createFemale = (name, age) => {
  return new Person(name, age, 'F')
}

const createMale = (name, age) => {
  return new Person(name, age, 'M')
}

const woman = createFemale('Jane Doe', 20)
const man = createMale('Sam Doe', 20)

```
</details>

<details>
  <summary>절차</summary>

  ```
  1. 팩터리 함수를 만들고 원래의 생성자를 호출한다.
  2. 생성자를 호출하던 코드를 팩터리함수로 대체한다. 하나씩 바꿀 때마다 테스트를 수행한다.
  3. 생성자의 가시범위가 최소가 되도록 제한한다.
  ```

</details>

<br />

#### 9. 함수를 명령으로 바꾸기
> #### 명령 객체(명령)
> 함수를 그 함수만을 위한 객체 안으로 캡슐화할 때 그 객체를 일컫는다. 명령 객체는 대부분 메서드 하나로 구성된다.
> 일급함수를 지원하지 않는 상황에서 사용할 수 있다.

<details>
<summary>개요 코드</summary>

```javascript

// before
function score(candidate, medicalExam, scoringGuide) {
  let result = 0
  let healthLevel = 0
  let highMedicalRiskFlag = false

  if (medicalExam.isSmoker) {
    healthLevel += 10
    highMedicalRiskFlag = true
  }

  let certificationGrade = 'regular'
  if (scoringGuide.stateWithLowCertification(candidate.originState)) {
    certificationGrade = 'low'
    result -= 5
  }

  result -= Math.max(healthLevel - 5, 0)
  return result
}

//after
const score = (candidate, medicalExam, scoringGuide) => {
  return new Scorer().execute(candidate, medicalExam, scoringGuide)
}

class Scorer {
  constructor(candidate, medicalExam, scoringGuide) {
    this._candidate = candidate
    this._medicalExam = medicalExam
    this._scoringGuide = scoringGuide
  }

  execute() {
    let result = 0
    let healthLevel = 0
    let highMedicalRiskFlag = false

    if (this._medicalExam.isSmoker) {
      healthLevel += 10
      highMedicalRiskFlag = true
    }

    let certificationGrade = 'regular'
    if (this._scoringGuide.stateWithLowCertification(this._candidate.originState)) {
      certificationGrade = 'low'
      result -= 5
    }

    result -= Math.max(healthLevel - 5, 0)
    return result
  }
}

// 가다듬기
class Scorer {
  constructor(candidate) {
    this._candidate = candidate
    this._medicalExam = medicalExam
    this._scoringGuide = scoringGuide
  }

  // 중첩함수로 사용
  scoreSmoking() {
    if (this._medicalExam.isSmoker) {
      this._healthLevel += 10
      this._highMedicalRiskFlag = true
    }
  }

  execute() {
    this._result = 0
    this._healthLevel = 0
    this._highMedicalRiskFlag = false

    this.scoreSmoking()

    this._certificationGrade = 'regular'
    if (this.scoringGuide.stateWithLowCertification(this.candidate.originState)) {
      this._certificationGrade = 'low'
      this._result -= 5
    }

    this._result -= Math.max(this._healthLevel - 5, 0)
    return this._result
  }
}
```

</details>

  <details>
  <summary>절차</summary>

  ```
  1. 대상 함수를 옮길 빈 클래스를 만든다.
  2. 방금 생성한 빈 클래스로 함수를 옮긴다. 리팩터링이 끝날 떄까지는 원래 함수를 전달 함수로 사용한다.
  3. 함수의 인수들을 명령 객체의 필드로 만들고 생성자를 통해 값을 설정할지 결정한다.
  ```

  </details>

  > #### 첨언
  > pay-main HometaxScraping 스토어에서 큰 기능을 각 메서드로 분리해둔 게 생각남

<br />

#### 10. 명령을 함수로 바꾸기
> 명령객체는 큰 함수 하나를 여러 개의 작은 메서드로 쪼개고, 필드를 통해 쪼개진 메서드들끼리 정보를 공유할 수 있는 장점이 있다.
> <br/>
> 그러나, 로직이 크게 복잡하지 않다면 명령 객체를 평범한 하나의 함수로 바꿔주는 것이 낫다.

  <details>
  <summary>개요 코드</summary>
  
  ```javascript
  // before
  class ChargeCalculator {
    constructor(customer, usage, provider) {
      this._customer = customer
      this._usage = usage
      this._provider = provider
    }

    get baseCharge() {
      return this._customer.baseRate * this._usage
    }

    get charge() {
      return this.baseCharge + this._provider.connectionCharge
    }
  }
  
  // after
  function charge(customer, usage, provider) {
    const baseCharge = customer.baseRate * usage
    return baseCharge + provider.connectionCharge
  }

  ```

  </details>

  <details>
  <summary>절차</summary>

  ```
  1. 명령 생성 코드와 실행 메서드들을 함수로 추출한다.
  2. 함수 내부에서 호출하는 보조 메서드들을 인라인한다.
  3. 생성자의 매개변수 모두를 실행 메서드로 옮긴다.
  4. 실행 메서드에서 참조하는 모든 필드를 매개변수로 바꾼다.
  ```

  </details>

<br />

#### 11. 수정된 값 반환하기
> 데이터가 수정된다면 그 사실을 명확하게 알려주어 어느 함수가 무슨 일을 하는지 쉽게 알 수 있게 해야 한다.

  <details>
  <summary>개요 코드</summary>
  
  ```javascript
  // before
  let totalAscent = 0
  let totalTime = 0
  let totalDistance = 0

  calculateAscent()
  calculateTime()
  calculateDistance()

  const pace = totalTime / 60 / totalDistance

  function calculateAscent() {
    for (let i = 1;i < points.length;i++) {
      const verticalChange = points[i].elevation - points[i].elevation
      totalAscent += (verticalChange > 0)? verticalChange : 0 // totalAscent 변경이 hidden
    }
  }

  //after
  totalAscent = calculateAscent()

  function calculateAscent() {
    let result = 0
    for (let i = 1;i < points.length;i++) {
      const verticalChange = points[i].elevation - points[i].elevation
      result += (verticalChange > 0)? verticalChange : 0
    }

    return result
  }

  ```

  </details>

  <details>
  <summary>절차</summary>

  ```
  1. 함수에서 수정된 값을 반환하고 그 값을 자신의 변수에 저장한다.
  2. 반환될 값을 가리키는 새로운 지역 변수를 선언한다.
  3. 계산이 선언과 동시에 이루어지도록 통합하고 변수 이름을 새 역할에 맞도록 바꾼다.
  ```

  </details>

<br />

#### 12. 오류 코드를 예외로 바꾸기
> 예외를 사용하면 오류 코드를 일일히 검사하거나 오류를 식별해 콜스택 위로 던지는 일을 신경쓰지 않아도 된다.
> <br/>
> 예외는 예상 밖의 동작일 때만 쓰여야 한다.


  <details>
  <summary>개요 코드</summary>
  
  ```javascript
  // before
  function localShippingRules(country) {
    const data = countryData.shippingRules[country]
    if (data) return new ShippingRules(data)
    else return -23
  }

  function calculateShippingCosts(anOrder) {
    const shippingRules = localShippingRules(anOrder.country)
    if (shippingRules < 0) return shippingRules
  }

  const status = calculateShippingCosts(orderData)
  if (status < 0) errorList.push({order: orderData, errorCode: status})

  // after
  class OrderProcessingError extends Error {
    constructor(errorCode) {
      super(`주문 처리 오류: ${errorCode}`)
      this.code = errorCode
    }

    get name() {return 'OrderProcessingError'}
  }
  
  try {
    function localShippingRules(country) {
      const data = countryData.shippingRules[country]
      if (data) return new ShippingRules(data)
      else throw new OrderProcessingError(-23)
    }

    function calculateShippingCosts(anOrder) {
      const shippingRules = localShippingRules(anOrder.country)
    }

    calculateShippingCosts(orderData)
  } catch (e) {
    if (e instanceof OrderProcessingError) {
      errorList.push({order: orderData, errorCode: e.code})
    }
    else throw e
  }
  if (status < 0) errorList.push({order: orderData, errorCode: status})
  ```

  </details>

  <details>
  <summary>절차</summary>

  ```
  1. 콜스택 상위에 예외를 처리할 핸들러를 작성한다. 초기에는 모든 예외를 throw하도록 한다.
  2. 오류 코드를 대체할 예외와 그밖의 예외를 구분할 식별 방법을 결정한다. (ex. 서브 클래스)
  3. catch문에서 직접 처리할 수 있는 예외는 처리하고 나머지 예외는 throw한다.
  4. 오류 코드를 반환하는 곳 모두에서 예외를 던지도록 수정한다.
  ```

  </details>

<br />

  #### 13.예외를 사전확인으로 바꾸기
  > 함수 호출 전에 문제가 될 수 있는 조건을 확인할 수 있다면 예외 대신 호출하는 곳에서 조건을 검사한다.

  <details>
  <summary>개요 코드</summary>

  ```javascript
  router.post('/web/talktalk', bodyValidator(sendTalkTalkRequest), async (ctx) => {
    const {
      auth: {naverId, memberName},
      request: {body}
    } = ctx

    const {nfMngNum, baseDate} = body

    const params = {nfMngNum, baseDate, naverId, userName: memberName}

    const sendTalkTalkResult = await smeloanService.sendNaverTalkTalk(params)

    if (sendTalkTalkResult.error) { // (질문) 서버에서는 try catch로 해결하는게 좋으려나?
      ctx.body = createErrorResponse(sendTalkTalkResult)
      return
    }

    ctx.body = createSuccessResponse(sendTalkTalkResult)
  })
  ```
  
  </details>

  > #### 첨언
  > front-apigw에서 에러 핸들링 방식