# Chapter 07 - 캡슐화

- 캡슐화의 개요
  - 캡슐화는 정보 은닉의 기본
  - 보여줘야 할 것 (Interface)과 보여주면 안되는 것 (Private)를 분리하여 사용하는 입장에서 복잡성 감소 및 안정성 향상

1. 레코드 캡슐화하기

   - 데이터 레코드는 정의하고 사용하기 간단하지만 계산해서 얻을 수 있는 값 (Computed Value)와 그렇지 않은 값을 명확히 구분해야 하는 단점이 있다.
   - 따라서, 클래스로 레코드를 묶는다면 Class의 Getter를 통하여 값을 구분하는데 도움이 될 수 있다.

   <details>
   <summary>Examples</summary>

   ```js
   const myWaterCart = {price: 1500, amount: 5}
   const totalPrice = myWaterCart.price * myWaterCart.amount
   ```

   ```js
   class Cart {
     constructor(data) {
       this._price = data.price
       this._amount = data.amount
     }

     get price() {
       return _price
     }

     set price(arg) {
       this._price = arg
     }

     get amount() {
       return _amount
     }

     set amount(arg) {
       this._amount = arg
     }

     // Compiuted Value
     get totalPrice() {
       return this._price * this._amount
     }
   }

   const myWaterCart = new Cart({price: 1500, amount: 5})
   const totalPrice = myWaterCart.totalPrice
   ```

   </details>

2. 컬렉션 캡슐화하기

   - 필요한 인터페이스만 노출하자
   - 무분별한 Getter/Setter 보다 Getter할 대상의 필요한 인터페이스 (add, remove, etc.)만 노출

   <details>
   <summary>Examples</summary>

   ```js
   class Refrigerator {
     constructor() {
       this._grocery = []
     }

     get grocery() {
       return this._grocery
     }

     set grocery(arg) {
       this._grocery = arg
     }
   }

   // 사실 grocery는 Reference 객체라서 set을 안해도 됩니다.
   const myRefrigerator = new Refrigerator()
   myRefrigerator.grocery(myRefrigerator.grocery.concat('Egg'))

   const myGroceryCabinet = myRefrigerator.grocery
   myGroceryCabinet.push('Tofu')
   myRefrigerator.grocery(myGroceryCabinet)

   myGroceryCabinet.splice(
     this._grocery.findIndex((item) => item === 'Tofu'),
     1
   )
   myRefrigerator.grocery(myGroceryCabinet)
   ```

   ```js
   class Refrigerator {
     constructor() {
       this._grocery = []
     }

     addGrocery(grocery) {
       this._grocery.push(grocery)
     }

     removeGrocery(arg) {
       this._grocery.splice(
         this._grocery.findIndex((item) => item === arg),
         1
       )
     }
   }

   const myRefrigerator = new Refrigerator()
   myRefrigerator.addGrocery('Egg')
   myRefrigerator.addGrocery('Tofu')
   myRefrigerator.removeGrocery('Tofu')
   ```

   </details>

3. 기본형을 객체로 바꾸기

   - 단순히 String이나 Number로 사용되던 특정 상태를 객체로 바꿉니다.
   - 객체로 바꾸면 함수를 추가할 수 있으므로 상태 비교등을 객체 내부로 캡슐화할 수 있습니다.

   <details>
   <summary>Examples</summary>

   ```js
   const myCpus = ['Intel Core i7', 'Core i5', 'AMD RyZen 9']

   const myIntelCpus = myCpus.filter((cpu) => cpu.startsWith('Intel') || cpu.startsWith('Core'))
   ```

   ```js
   const myCpus = [
     {name: 'Intel Core i7', brand: 'Intel'},
     {name: 'Core i5', brand: 'Intel'},
     {name: 'AMD RyZen 9', brand: 'AMD'},
   ]

   const myIntelCpus = myCpus.filter((cpu) => cpu.brand == 'Intel')
   ```

   ```js
       const IntelBrand = {
           name: "Intel",
           sloagun: "Leap Ahead",
           ceo: "Robert Holmes Swan",
           stock: 52.82
       }

       const AmdBrand = {
           name: "AMD",
           sloagun "Fusion is Future",
           ceo: "Lisa Tzwu-Fang Su",
           stock: 83.1
       }

       const myCpus = [
           { name: "Intel Core i7", brand: IntelBrand },
           { name: "Intel Core i5", brand: IntelBrand },
           { name: "AMD RyZen 9", brand: AmdBrand }
       ]

       const myIntelCpus = myCpus.filter(cpu => cpu.brand.stock <= 50.0);
   ```

   </details>

4. 임시 변수를 질의 함수로 바꾸기

   - 비즈니스 로직에 있는 계산된 임시 변수를 제거합니다.
   - 계산된 임시 변수는 함수로 캡슐화합니다.

   <details>
   <summary>Examples</summary>

   ```js
   class Status {
     lockFrontDoor() {
       this.front = true
     }

     unlockFrontDoor() {
       this.front = false
     }

     lockRearDoor() {
       this.rear = true
     }

     unlockRearDoor() {
       this.rear = false
     }

     get frontDoorStatus() {
       return this.front
     }

     get rearDoorStatus() {
       return this.rear
     }
   }

   const myDoorStatus = new Status()

   myDoorStatus.lockFrontDoor()
   myDoorStatus.lockRearDoor()
   myDoorStatus.unlockRearDoor()

   if (myDoorStatus.frontDoorStatus && myDoorStatus.rearDoorStatus) {
     console.log('Safe!')
   } else {
     console.log('Unsafe!')
   }
   ```

   ```js
   class Status {
     // {...}

     get isSafe() {
       return this.frontDoorStatus && this.rearDoorStatus
     }
   }

   const myDoorStatus = new Status()

   // {...}

   if (myDoorStatus.isSafe) {
     console.log('Safe!')
   } else {
     console.log('Unsafe!')
   }
   ```

   </details>

5. 클래스 추출하기

   > 클래스의 일부 데이터+로직을 별개의 클래스로 추출  
   > 역할을 분리할 수 있음

   - 데이터와 메서드를 따로 묶을 수 있는 경우
   - 함께 변경되는 일이 많거나 서로 의존하는 데이터
   - 제거해도 다른 필드나 메서드에 문제 없으면 분리 가능

   <details>
   <summary>개요 코드</summary>

   ```js
   // Before
   class Person {
     get officeAreaCode() {
       return this._officeAreaCode
     }
     get officeNumber() {
       return this._officeNumber
     }
   }
   ```

   ```js
   // After
   class Person {
     get officeAreaCode() {
       return this._telephoneNumber.areaCode
     }
     get officeNumber() {
       return this._telephoneNumber.number
     }
   }

   class TelephoneNumber {
     get areaCode() {
       return this._areaCode
     }
     get number() {
       return this._number
     }
   }
   ```

   </details>

   <details>
   <summary>절차</summary>

   1. 클래스의 역할을 분리할 방법을 정한다.
   2. 분리될 역할을 담당할 클래스를 새로 만든다.
      - 원래 클래스에 남은 클래스 역할과 이름이 어울리지 않는다면 적절히 바꾼다.
   3. 원래 클래스의 생성자에서 새로운 클래스의 인스턴스를 생성하여 필드에 저장해둔다.
   4. 분리될 역할에 필요한 필드들을 새 클래스로 옮긴다(8.2). 하나씩 옮길 때마다 테스트한다.
   5. 메서드들도 새 클래스로 옮긴다(8.1). 이대 저수준 메서드, 즉 다른 메서드를 호출하지보다는 호출을 당하는 일이 많은 메서드부터 옮긴다. 하나씩 옮길 때마다 테스트한다.
   6. 양쪽 클래스의 인터페이스를 살펴보면서 불필요한 메서드를 제거하고, 이름도 새로운 환경에 맞게 바꾼다.
   7. 새 클래스를 외부로 노출할지 정한다. 노출하려거든 새 클래스에 참조를 값으로 바꾸기(9.4)를 적용할지 고민해본다.

   </details>

6. 클래스 인라인하기

   > 클래스 추출하기(7.5)의 반대

   - 제 역할을 못 해서 그대로 두면 안 되는 클래스가 대상
     - 역할을 옮기는 리패터링 후 특정 클래스에 남은 역할이 거의 없을 때 주로 발생
     - 이 클래스의 역할을 가장 많이 사용하는 클래스로 흡수
   - 두 클래스의 기능을 지금과 다르게 배분하고 싶을 때에도 사용
     - 두 클래스를 인라인 해서 하나로 합친 두, 다시 새로운 클래스로 추출(7.5)

   <details>
   <summary>개요 코드</summary>

   ```js
   // Before
   class Person {
     get officeAreaCode() {
       return this._telephoneNumber.areaCode
     }
     get officeNumber() {
       return this._telephoneNumber.number
     }
   }

   class TelephoneNumber {
     get areaCode() {
       return this._areaCode
     }
     get number() {
       return this._number
     }
   }
   ```

   ```js
   // After
   class Person {
     get officeAreaCode() {
       return this._officeAreaCode
     }
     get officeNumber() {
       return this._officeNumber
     }
   }
   ```

   </details>

   <details>
   <summary>절차</summary>

   1. 소스 클래스의 각 public 메서드에 대응하는 메서스들을 타깃 클래스에 생성한다. 이 메서드들은 단순히 작업을 소스 클래스로 위임해야 한다.
   2. 소스 클래스의 메서드를 사용하는 코드를 모두 타깃 클래스의 위임 메서드를 사용하도록 바꾼다. 하나씩 바꿀 때마다 테스트한다.
   3. 소스 클래스의 메서드와 필드를 모두 타깃 클래스로 옮긴다. 하나씩 옮길 때마다 테스트한다.
   4. 소스 클래스를 삭제하고 조의를 표한다.

   </details>

7. 위임 숨기기

   > 모듈화 설계를 제대로 하는 핵심은 캡슐화  
   > 클라이언트가 위임 객체의 존재를 몰라도 되도록 감춤

   <details>
   <summary>개요 코드</summary>

   ```js
   // Before
   const manager = aPerson.department.manager
   ```

   ```js
   // After
   const manager = aPerson.manager

   class Person {
     get manager() {
       return this.department.manager
     }
   }
   ```

   </details>

   <details>
   <summary>절차</summary>

   1. 위임 객체의 각 메서드에 해당하는 위임 메서드를 서버에 생성한다.
   2. 클라이언트가 위임 객체 대신 서버를 호출하도록 수정한다. 하나씩 바꿀 때마다 테스트한다.
   3. 모두 수정했다면, 서버로부터 위임 객체를 얻는 접근자를 제거한다.
   4. 테스트한다.

   </details>

8. 중개자 제거하기

   > 위임 숨기기(7.7)의 반대  
   > 클라이언트가 위임 객체의 다른 기능을 사용하고 싶을 대마다 서버에 위임 메서드 추가 필요  
   > 차라리 클라이언트가 위임 객체를 직접 호출하는 게 나을 수 있음  
   > 위임 숨기기(7.7)과의 균형점은 상황에 따라 다름

   - 서버 클래스가 단순히 중개자 역할만 할 때

   <details>
   <summary>개요 코드</summary>

   ```js
   // Before
   const manager = aPerson.manager

   class Person {
     get manager() {
       return this.department.manager
     }
   }
   ```

   ```js
   // After
   const manager = aPerson.department.manager
   ```

   </details>

   <details>
   <summary>절차</summary>

   1. 위임 객체를 얻는 게터를 만든다.
   2. 위임 메서드를 호출하는 클라이언트가 모두 이 게터를 거치도록 수정한다. 하나씩 바꿀 때마다 테스트한다.
   3. 모두 수정했다면 위임 메서드를 삭제한다.
      - 자동 리팩터링 도구를 사용할 때는 위임 필드를 캡슐화(6.6)한 다음, 이를 사용하는 모든 메서드를 인라인(6.2)한다.

   </details>

9. 알고리즘 교체하기

   > 복잡한 기존 코드를 간명한 방식으로 수정  
   > (흔히 생각하는 리팩터링)

   - 목적을 달성하는 더 쉬운 코드가 있을 때
   - 코드와 똑같은 기능을 제공하는 라이브러리가 있을 때
   - 알고리즘을 살짝 다르게 동작하도록 바꾸고 싶을 때

   <details>
   <summary>개요 코드</summary>

   ```js
   // Before
   function foundPerson(people) {
     for (let i = 0; i < people.length; i++) {
       if (people[i] === 'Don') {
         return 'Don'
       }
       if (people[i] === 'John') {
         return 'John'
       }
       if (people[i] === 'Kent') {
         return 'Kent'
       }
     }
     return ''
   }
   ```

   ```js
   // After
   function foundPerson(people) {
     const candidates = ['Don', 'John', 'Kent']
     return people.find((p) => candidates.includes(p)) || ''
   }
   ```

   </details>

   <details>
   <summary>절차</summary>

   1. 교체할 코드를 함수 하나에 모은다.
   2. 이 함수만을 이용해 동작을 검증하는 테스트를 마련한다.
   3. 대체할 알고리즘을 준비한다.
   4. 정적 검사를 수행한다.
   5. 기존 알고리즘과 새 알고리즘의 결과를 비교하는 테스트를 수행한다. 두 결과가 같다면 리팩터링이 끝난다. 그렇지 않다면 기존 알고리즘을 참고해서 새 알고리즘을 테스트하고 디버깅한다.
   </details>

## 논의 사항

스토어 내부 객체를 표현하려는데, 두 가지 방법의 장단점이 있어 고민중  
개인적으로는 클래스 방식이 더 끌리긴 함ㅎㅎ

```js
// 클래스 방식
class Card {
  /**
   * @private
   */
  $name

  /**
   * @private
   */
  $checkAmount

  /**
   * @private
   */
  $creditAmount

  constructor({creditAmt, checkAmt, istnNm}) {
    this.$name = istnNm
    this.$checkAmount = parseInt(checkAmt)
    this.$creditAmount = parseInt(creditAmt)
  }

  get name() {
    return this.$name
  }

  get creditAmount() {
    return this.$creditAmount
  }

  get checkAmount() {
    return this.$checkAmount
  }

  set checkAmount(newCheckAmount) {
    this.$checkAmount = newCheckAmount
  }

  get totalAmount() {
    return this.checkAmount + this.creditAmount
  }

  addOverduePanalty() {
    this.checkAmount += OVERDUE_PANALTY
  }
}

// decorator 문법을 사용하지 않기 때문에, 별도로 처리 필요
decorate(Card, {
  $name: observable,
  $checkAmount: observable,
  $creditAmount: observable,
  name: computed,
  creditAmount: computed,
  checkAmount: computed,
  totalAmount: computed,
  addOverduePanalty: action,
})

/*
위 과정을 조금 더 간단히 줄여주는 유틸 정도는 작성 가능할 듯
예상 인터페이스: autoDecorate(Card, ['$name', '$checkAmount', '$creditAmount])
*/

// 만약 상속이 필요하다면 클래스 자체를 export 해야 함
export const createCard = (cardData) => new Card(cardData)
```

```js
// 함수 방식

export const createCard = ({creditAmt, checkAmt, istnNm}) => {
  let $checkAmount = parseInt(checkAmt) // Mutable
  const $creditAmount = parseInt(creditAmt) // Immutable

  return {
    get name() {
      return istnNm
    },

    get creditAmount() {
      return $creditAmount
    },

    get checkAmount() {
      return $checkAmount
    },

    set checkAmount(newCheckAmount) {
      $checkAmount = newCheckAmount
    },

    get totalAmount() {
      return this.creditAmount + this.checkAmount
    },

    addOverduePanalty() {
      this.checkAmount += OVERDUE_PANALTY
    },

    // 필요한 이유는 "단점" 에서 설명
    clone() {
      return createCard({creditAmt, checkAmt, istnNm})
    },
  }
}
```

### 클래스 방식

- 기존 코드와 스타일이 달라짐 (근데 스토어 쪼개기부터 이미 스타일이 다르긴 함..)
- mobx observable 처리 필요 (유틸함수 프로토타이핑 중)
  - 복제 후에도 observable이 유지되는지 확인 필요 (아마 될듯)
- (사람마다 다르겠지만 적어도 내 눈에는) 직관적으로 보임
- lodash.clone 함수는 클래스 객체의 복제도 지원
- 실제 private 으로 동작은 하지 않아도, 메타주석을 통해 IDE 지원은 가능
- 다중 상속 불가 (믹스인은 가능하긴 함)
- 자동완성, 린트 등 도구 지원이 좋음

### 함수 방식

- 기존 코드와 스타일이 비슷
- 믹스인이 간단 (자주 필요할지는 잘 모르겠음;)
- private field를 클로저로 숨길 수 있음
- 타입 확인 어려움
- 복제 이슈
  - 복제시 getter/setter 제대로 복제 안됨
    - getter/setter 사용 안하고 그냥 다 프로퍼티로 때려넣으면 괜찮음;
  - lodash.clone 해도 같은 내부에서 클로저를 보고 있어서 private 변수를 공유
    - lodash.cloneWith + clone 함수로 회피 가능하긴 함
    - 하지만 비 직관적..
- prototype chaining 이 없으므로 메모리 더 소비
  - 불필요할 수 있는 클로저 다수 유지

### 기타

- 근데 스토어에서만 사용할거면 복제가 굳이 필요 없을수도 있음

  - 대부분의 경우 스토어의 값을 변경하는건, 모든 곳에서 변경이 일어나게 하려는 목적일듯..
  - 컴포넌트에서 값을 표현하기 위해 sort 등의 함수를 사용하는 경우 필요함 (사이드이펙트)
    - 단순히 리스트만 복제하면 문제 없긴 함
  - 근데 왤케 찝찝하지;;

```js
const card = createCard({
  creditAmt: '0',
  checkAmt: '1000',
  istnNm: '네이버카드',
})

const cloneOfCard = _.cloneWith(card, (target) => {
  if (typeof target.clone === 'function') {
    return target.clone()
  }
})
```
