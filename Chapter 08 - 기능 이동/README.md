##### Chapter 08 - 기능 이동

<!-- 챕터 개요 -->

1. 함수 옮기기

   > 함수를 한 곳에서 다른 곳으로 이동  
   > 다음 여러 가지 형태를 보일 수 있음
   >
   > - inner 함수를 최상위로 이동
   > - A 클래스의 메서드를 B 클래스로 이동
   > - A 모듈의 함수를 B 모듈로 이동
   > - 기타

   - 함수가 자신이 속한 모듈의 요소들보다 다른 모듈의 요소들을 더 많이 참조할 때
   - 다른 함수 안에서 도우미 역할로 정의된 함수 중 독립적인 가치가 있는 함수가 있을 때

   <details>
   <summary>개요 코드</summary>

   ```js
   // Before
   class Account {
     get overdraftCharge() {
       // ...
     }
   }
   ```

   ```js
   // After
   class Account {
     get overdraftCharge() {
       return this.type.overdraftCharge()
     }
   }

   class AccountType {
     get overdraftCharge() {
       // ...
     }
   }
   ```

   </details>

   <details>
   <summary>절차</summary>

   1. 선택한 함수가 현재 컨텍스트에서 사용 중인 모든 프로그램 요소를 살펴본다. 이 요소들 중에도 함께 옮겨야 할 게 있는지 고민해본다.
   2. 선택한 함수가 다형 메서드인지 확인한다.
   3. 선택한 함수를 타깃 컨텍스트로 복사한다. 타깃 함수가 새로운 터전에 잘 자리 잡도록 다듬는다.
   4. 정적 분석을 수행한다.
   5. 소스 컨텍스트에서 타깃 함수를 참조할 방법을 찾아 반영한다.
   6. 소스 함수를 타깃 함수의 위임 함수가 되도록 수정한다.
   7. 테스트한다.
   8. 소스 함수를 인라인(6.2)할지 고민해본다.
   </details>

2. 필드 옮기기

   > 필드를 한 곳에서 다른 곳으로 이동  
   > 즉, 데이터 구조의 변경  
   > 아래 목록에서 "레코드"는 "클래스"나 "객체"로 치환 가능

   - 함수에 어떤 레코드를 넘길 때 마다 또 다른 레코드의 필드도 함께 넘기고 있을 때
   - 한 레코드를 변경하는데 다른 레코드의 필드까지 변경해야 할 때
   - 구조체 여러 개에 정의된 똑같은 필드들을 갱신해야 할 때

   <details>
   <summary>개요 코드</summary>

   ```js
   // Before
   class Customer {
       get plan() {
           return this._plan;
       }

       get discountRate() {
           returh this._discountRate
       }
   }
   ```

   ```js
   // After
   class Customer {
       get plan() {
           return this._plan;
       }

       get discountRate() {
           returh this.plan.discountRate
       }
   }
   ```

   </details>

   <details>
   <summary>절차</summary>

   1. 소스 필드가 캡슐화되어 있지 않다면 캡슐화한다.
   2. 테스트한다.
   3. 타깃 객체에 필드(와 접근자 메서드들)을 생성한다.
   4. 정적 검사를 수행한다.
   5. 소스 객체에서 타깃 객체를 참조할 수 있는지 확인한다.
   6. 접근자들이 타깃 필드를 사용하도록 수정한다.
   7. 테스트한다.
   8. 소스 필드를 제거한다.
   9. 테스트한다.
   </details>

3. 문장(Statements)을 함수로 옮기기

   > 함수와 같이 사용하는 문장을 함수 안으로 이동
   > 피호출 함수와 한 몸은 아니지만, 여전히 함께 호출돼야 하는 경우라면 둘을 합쳐 별개의 함수로 추출(6.1)하는 방법도 가능

   - 특정 함수를 호출할 때 마다 그 앞이나 뒤에서 똑같은 문장이 반복될 때

   <details>
   <summary>개요 코드</summary>

   ```js
   // Before
   result.push(`<p>제목: ${person.photo.title}</p>`)
   result.concat(photoData(person.photo))

   function photoData(aPhoto) {
     return [
       `<p>위치: ${aPhoto.location}</p>`,
       `<p>날짜: ${aPhoto.date.toDateString()}</p>`,
       `<p>태그: ${aPhoto.tag}</p>`,
     ]
   }
   ```

   ```js
   // After
   result.concat(photoData(person.photo))

   function photoData(aPhoto) {
     return [
       `<p>제목: ${aPhoto.title}</p>`,
       `<p>위치: ${aPhoto.location}</p>`,
       `<p>날짜: ${aPhoto.date.toDateString()}</p>`,
       `<p>태그: ${aPhoto.tag}</p>`,
     ]
   }
   ```

   </details>

   <details>
   <summary>절차</summary>

   1. 반복 코드가 함수 호출 부분과 멀리 떨어져 있다면 문장 슬라이스하기(8.6)를 적용해 근처로 옮긴다.
   2. 타깃 함수를 호출하는 곳이 한 곳뿐이면, 단순히 소스 위치에서 해당 코드를 잘라내어 피호출 함수로 복사하고 테스트한다. 이 경우하면 나머지 단계는 무시한다.
   3. 호출자가 둘 이상이면 호출자 중 하나에서 '타깃 함수 호출 부분과 그 함수로 옮기려는 문장등을 함께' 다른 함수로 추출(6.1)한다. 추출한 함수에 기억하기 쉬운 임시 이름을 지어준다.
   4. 다른 호출자 모두가 방금 추출한 함수를 사용하도록 수정한다. 하나씩 수정할 때마다 테스트한다.
   5. 모든 호출자가 새로운 함수를 사용하게 되면 원래 함수를 새로운 함수 안으로 인라인(6.2)한 후 원해 함수를 제거한다.
   6. 새로운 함수의 이름을 원래 함수의 이름으로 바꿔준다(6.5). (더 나은 이름이 있다면 그 이름을 쓴다)
   </details>

4. 문장을 호출한 곳으로 옮기기

   > 함수의 기능을 쪼개서 문장을 밖으로 이동  
   > 경우에 따라 문장을 더 슬라이스 하거나 함수로 추출할 수도 있음

   - 함수가 둘 이상의 다른 일을 하는데, 그 중 하나만 변경이 필요할 때

   <details>
   <summary>개요 코드</summary>

   ```js
   // Before
   emitPhotoData(outStream, person.photo)

   function emitPhotoData(outStream, photo) {
     outStream.write(`<p>제목: ${photo.title}</p>\n`)
     outStream.write(`<p>위치: ${photo.location}</p>\n`)
   }
   ```

   ```js
   // After
   emitPhotoData(outStream, person.photo)
   outStream.write(`<p>위치: ${person.photo.location}</p>\n`)

   function emitPhotoData(outStream, photo) {
     outStream.write(`<p>제목: ${photo.title}</p>\n`)
   }
   ```

   </details>

   <details>
   <summary>절차</summary>

   1. 호출자가 한두 개뿐이고 피호출 함수도 간단한 단순한 상황이면, 피호출 함수의 처음(혹은 마지막)줄(들)을 잘라내어 호출자(들)로 복사해 넣는다(필요하면 적당히 수정한다). 테스트만 통과하면 이번 리팩토링은 여기서 끝이다.
   2. 더 복잡한 상황에서는, 이동하지 '않길' 원하는 모든 문장을 함수로 추출(6.1)한 다음 검색하기 쉬운 임시 이름을 지어준다.
   3. 원래 함수를 인라인(6.2)한다.
   4. 추출된 함수의 이름을 원래 함수의 이름으로 변경한다(6.5). (더 나은 이름이 있다면 그 이름을 쓴다)
   </details>

5. 인라인 코드를 함수 호출로 바꾸기

   > 똑같은 코드를 반복하는 대신 함수 호출로 변경  
   > 해당 기능을 하는 함수가 이미 존재한다면 이 방법 사용  
   > 해당 기능을 하는 함수가 없다면 함수 추출하기(6.1) 사용

   - 동일한 목적의 같은 코드가 반복 사용되고, 해당 목적의 함수가 존재할 때
     - (우연히) 같은 코드가 있더라도 다른 목적이라면 적용 X

   <details>
   <summary>개요 코드</summary>

   ```js
   // Before
   let appliesToMass = false
   for (const s of states) {
     if (s === 'MA') {
       appliesToMass = true
     }
   }
   ```

   ```js
   // After
   aookuesToMass = states.includes('MA')
   ```

   </details>

   <details>
   <summary>절차</summary>

   1. 인라인 코드를 함수 호출로 대체한다.
   2. 테스트한다.
   </details>

6. 문장 슬라이드하기

   > 관련 있는 코드들을 한 곳으로 뭉치도록 이동

   - 관련있는 코드가 흩어져 있을 때

   <details>
   <summary>개요 코드</summary>

   ```js
   // Before
   const pricingPlan = retrievePricingPlan()
   const order = retreiveOrder()
   let charge
   const chargePerUnit = pricingPlan.unit
   ```

   ```js
   // After
   const pricingPlan = retrievePricingPlan()
   const chargePerUnit = pricingPlan.unit
   const order = retreiveOrder()
   let charge
   ```

   </details>

   <details>
   <summary>절차</summary>

   1. 코드 조각(문장들)을 이동할 목표 위치를 찾는다. 코드 조각의 원래 위치와 목표 위치 사이의 코드들을 훑어보면서, 조각을 모으고 나면 동작이 달라지는 코드가 있는지 살핀다. 다음과 같은 간섭이 있다면 이 리팩토링을 포기한다.
      - 코드 조각에서 참조하는 요소를 선언하는 문장 앞으로는 이동할 수 없다.
      - 코드 조각을 참조하는 요소의 뒤로는 이동할 수 없다.
      - 코드 조각에서 참조하는 요소를 수정하는 문장을 건너뛰어 이동할 수 없다.
      - 코드 조각이 수정하는 요소를 참조하는 요소를 건너뛰어 이동할 수 없다.
   2. 코드 조각을 원래 위치에서 잘라내어 목표 위치에 붙여 넣는다.
   3. 테스트한다.
   </details>

7. 반복문 쪼개기

   > 반복문을 단일 목적만을 수행하는 여러개의 반복문으로 쪼개기  
   > 리팩터링과 최적화는 구분하자. 여러개의 반복문이 병목이라는게 밝혀지면 그때 합치는건 간단

   - 반복문 하나에서 두 가지 이상의 일을 할 때

   <details>
   <summary>개요 코드</summary>

   ```js
   // Before
   let averageAge = 0
   let totalSalary = 0
   for (const p of people) {
     averageAge += p.age
     totalSalary += p.salary
   }
   averageAge = averageAge / people.length
   ```

   ```js
   // After
   let totalSalary = 0
   for (const p of people) {
     totalSalary += p.salary
   }

   let averageAge = 0
   for (const p of people) {
     averageAge += p.age
   }
   averageAge = averageAge / people.length
   ```

   </details>

   <details>
   <summary>절차</summary>

   1. 반복문을 복제해 두 개로 만든다.
   2. 반복문이 중복되어 생기는 부수효과를 파악해서 제거한다.
   3. 테스트한다.
   4. 완료됐으면, 각 반복문을 함수로 추출(6.1)할지 고민해본다.
   </details>

<!-- 까지 황현구, 이후 기원님 -->

8. 반복문을 파이프라인으로 바꾸기

<!-- TODO: 내용 작성 -->

9. 죽은 코드 제거하기

<!-- TODO: 내용 작성 -->

## 논의 사항

- 중첩함수  
  285p에서 중첩함수는 되도록 만들지 말라고 언급
