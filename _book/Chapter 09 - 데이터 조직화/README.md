# Chapter 09 - 데이터 조직화

1. 변수 쪼개기

   > 하나의 변수에 두개 이상의 역할이 있다면 해당 변수를 나눠준다.

    <details>
    <summary>개요 코드</summary>

   ```js
   let temp = 2 * (height + width)
   temp = height * width
   ```

   ```js
   const perimeter = 2 * (height + width)
   const area = height * width
   ```

    </details>

2. 필드 이름 바꾸기

   > 데이터 필드의 이름은 데이터 구조와 프로그램을 이해하기 위해서 중요하다.
   > 레코드 캡슐화를 선행하자.

   <details>
   <summary>개요 코드</summary>

   ```javascript
   //before
   class Organization {
     constructor(data) {
       this._name = data.name
       this._country = data.country
     }
     get name() {
       return this._name
     }
     set name(aString) {
       this._name = aString
     }
     get country() {
       return this._country
     }
     set country(aCountryCode) {
       this._country = aCountryCode
     }
   }
   ```

   ```javascript
   //after
   class Organization {
     constructor(data) {
       this._title = data.name
       this._country = data.country
     }
     get title() {
       return this._title
     }
     set title(aString) {
       this._title = aString
     }
     get country() {
       return this._country
     }
     set country(aCountryCode) {
       this._country = aCountryCode
     }
   }
   ```

   </details>

   <details>
   <summary>절차</summary>
   1. 레코드의 유효범위가 제한적이라면 필드에 접근하는 모든 코드를 수정한 후 테스트를 한다. 이후 단계는 필요없다.
   2. 레코드가 캡슐화되지 않았다면 캡슐화
   3. 캡슐화된 객체안의 private 필드명을 변경하고, 그에 맞게 매서드 수정
   4. 테스트
   5. 생성자의 매개변수 중 필드와 이름이 겹치는 게 있다면 함수 선언 바꾸기로 변경한다.
   6. 접근자등의 이름도 바꿔준다.
   </details>

3. 파생 변수를 질의 함수로 바꾸기

   > 가변 데이터의 유효범위를 확실하게 정하여 사이드이펙트를 방지한다. 가변 데이터의 값을 계산해주는 함수를 만드는 방법을 적용해보자.

   <details>
   <summary>개요 코드</summary>

   ```js
   get discountTotal(){
       return this._discountedTotal
   }
   set discount(aNumber){
       const old = this._discount
       this._discount = aNumber
       this._discountedTotal += old - aNumber
   }
   ```

   ```js
   get discountedTotal(){
       return this._baseTotal - this._discount
   }
   set discount(aNumber){
       this._discount = aNumber
   }
   ```

   </details>

   <details>
   <summary>절차</summary>

   1. 변수 값이 갱신되는 지점을 찾는다. 필요하면 변수를 쪼갠다.
   2. 해당 변수 값을 계산해주는 함수를 정한다.
   3. 해당 변수가 사용되는 곳에 assertion을 추가하여 계산결과와 변수의 값이 같은지 확인해본다.
   4. 테스트
   5. 변수를 읽는 코드를 모두 함수호출로 대체한다.
   6. 테스트
   7. 변수를 선언하고 갱신한 코드를 제거한다.

   <details>

4. 참조를 값으로 바꾸기

   > 객체, 데이터의 불변성을 적용하면 사이드이펙트를 최소화할 수 있다.
   > 다만 상황에 따라 가변객체를 사용하는 경우가 있으니 조심하자.

   <details>
   <summary>절차</summary>
      1. 후보 클레스가 불변인지, 불변이 될 수 있는지 확인한다.
      2. 각각의 setter를 하나씩 제거한다.
      3. 이 값 객체의 필드들을 사용하는 동치성 비교 메서드를 만든다.
   </details>

   <details>
   <summary>개요 코드</summary>

   ```javascript
   class TelephoneNumber {
     constructor() {
       this._areaCode = ''
       this._number = ''
     }
     get areaCode() {
       return this._areaCode
     }
     set areaCode(arg) {
       this._areaCode = arg
     }
     get number() {
       return this._number
     }
     set number(arg) {
       this._number = arg
     }
   }

   class Person {
     constructor() {
       this._telephoneNumber = new TelephoneNumber()
     }
     get officeAreaCode() {
       return this._telephoneNumber.areaCode
     }
     set officeAreaCode(arg) {
       this._telephoneNumber.areaCode = arg
     }
     get officeNumber() {
       return this._telephoneNumber.number
     }
     set officeNumber(arg) {
       this._telephoneNumber.number = arg
     }
   }
   ```

   ```javascript
   class TelephoneNumber {
     constructor(areaCode, number) {
       this._areaCode = areaCode
       this._number = number
     }
     get areaCode() {
       return this._areaCode
     }
     set areaCode(arg) {
       this._areaCode = arg
     }
     get number() {
       return this._number
     }
     set number(arg) {
       this._number = arg
     }
     equals(other) {
       if (!(other instanceof TelephoneNumber)) {
         return false
       }
       return this.areaCode === other.areaCode && this.number === other.number
     }
   }

   class Person {
     constructor(areaCode, number) {
       this._telephoneNumber = new TelephoneNumber(areaCode, number)
     }
     get officeAreaCode() {
       return this._telephoneNumber.areaCode
     }
     set officeAreaCode(arg) {
       this._telephoneNumber = new TelephoneNumber(arg, this.officeNumber)
     }
     get officeNumber() {
       return this._telephoneNumber.number
     }
     set officeNumber(arg) {
       this._telephoneNumber = new TelephoneNumber(this.officeAreaCode, arg)
     }
   }
   ```

   </details>

5. 값을 참조로 바꾸기

   > 하나의 객체 A가 수정되었을때, 여러 객체에서 해당 사항을 반영해야하는 경우, 데이터의 일관성을 위해 값을 참조하도록 한다. 다만, A객체의 수정으로 인한 사이드이펙트를 주의하자.

   <details>
   <summary>절차</summary>
   1. 레코드의 유효범위가 제한적이라면 필드에 접근하는 모든 코드를 수정한 후 테스트를 한다. 이후 단계는 필요없다.
   2. 레코드가 캡슐화되지 않았다면 캡슐화
   3. 캡슐화된 객체안의 private 필드명을 변경하고, 그에 맞게 매서드 수정
   4. 테스트
   5. 생성자의 매개변수 중 필드와 이름이 겹치는 게 있다면 함수 선언 바꾸기로 변경한다.
   6. 접근자등의 이름도 바꿔준다.
   </details>

   <details>
   <summary>개요 코드</summary>

   ```javascript
   class Order {
     constructor(data) {
       this._number = data.number
       this._customer = new Costomer(data.customerId)
     }

     get customer() {
       return this._customer
     }
   }

   class Costomer {
     constructor(id) {
       this._id = id
     }

     get id() {
       return this._id
     }
   }
   ```

   ```javascript
   class Order {
     constructor(data) {
       this._number = data.number
       this._customer = registerCustomer(data.customerId)
     }

     get customer() {
       return this._customer
     }
   }

   class Costomer {
     constructor(id) {
       this._id = id
     }

     get id() {
       return this._id
     }
   }

   // 저장소 객체
   let _repositoryData

   export const initialize = () => {
     _repositoryData = {}
     _repositoryData.customer = new Map()
   }

   export const findCustomer = (id) => {
     return _repositoryData.customer.get(id)
   }

   export const registerCustomer = (id) => {
     if (!_repositoryData.customer.has(id)) {
       _repositoryData.customer.set(id, new Customer(id))
     }
     return findCustomer(id)
   }
   ```

   </details>

6. 매직 리터럴 바꾸기

   > 코드를 읽는 사람이 해당 값에대한 의미를 알 수 있도록 상수값에 할당한다.

   <details>
   <summary>절차</summary>
   1. 상수를 선언하고 매직 리터럴을 대입한다.
   2. 해당 리터럴이 사용되는 곳을 모두 찾는다.
   3. 같은 매직 리터럴이 상수와 같은 의미로 사용되었는지 확인후 수정한다.
   4. 테스트
   </details>
