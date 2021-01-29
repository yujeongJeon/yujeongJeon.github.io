# Chapter 07 - 캡슐화

    캡슐화는 정보 은닉의 기본
    보여줘야 할 것 (Interface)과 보여주면 안되는 것 (Private)를 분리하여 사용하는 입장에서 복잡성 감소 및 안정성 향상


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
