# Chapter 10 - 조건부 로직 간소화

1. 조건문 분해하기

   > 코드를 읽는 사람이 이해하기 쉽게 복잡한 조건문의 로직을 함수로 분리한다.

   <details>
   <summary>개요코드</summary>

   ```js
   if (!aDate.isBefore(plan.summerStart) && !aDate.isAfter(plan.summerEnd)) {
     charge = quantity * plan.summerRate
   } else {
     charge = quantity * plan.regularRate + plan.regularServiceCharge
   }
   ```

   ```js
   // 삼항연산자 활용
   charge = summer() ? summerCharge() : regularCharge()
   ```

   </details>

   <details>
   <summary>절차</summary>
   1. 조건식과 조건절을 각각 함수로 추출
   </details>

   - 논의사항
     - 삼항연산자 활용하는것 의견
     - 네이밍 관련: isValue, isValue(), setIsValue() ...
     - https://github.com/qkraudghgh/clean-code-javascript-ko#%EC%A1%B0%EA%B1%B4%EB%AC%B8%EC%9D%84-%EC%BA%A1%EC%8A%90%ED%99%94-%ED%95%98%EC%84%B8%EC%9A%94

2. 조건식 통합하기

   > 응집도가 높은 조건식을 하나의 조건식으로 구성함으로써 관리의 편의성을 높이고 추가로 함수로 추출할 수 있음

   <details>
   <summary>절차</summary>
   1. 해당 조건식들 모두에 부수효과가 없는지 확인
   2. 조건문 두 개를 선택하여 두 조건문의 조건식들을 논리 연산자로 결합
   3. 테스트
   4. 2~3 반복
   5. 합친 조건식을 함수로 추출할지 고려
   <details/>

   ```js
   if (anEmployee.seniority < 2) return 0
   if (anEmployee.monthsDisabled > 12) return 0
   if (anEmployee.isPartTime) return 0
   ```

   ```js
   if (isNotEligibleForDisability()) return 0

   function isNotEligibleForDisability() {
     return anEmployee.seniority < 2 || anEmployee.monthsDisabled > 12 || anEmployee.isPartTime
   }
   ```

3. 중첩 조건문을 보호 구문으로 바꾸기

   > 조건문 안의 조건문을 중첩으로 사용하기 보다 보호구문을 활용하면 코드를 읽는 사람이 로직을 이해하는데 편해진다.

   <details>
   <summary>개요 코드</summary>

   ```js
   function getPayAmount() {
     let result
     if (isDead) {
       result = deadAmount()
     } else {
       if (isSeparated) {
         result = separatedAmount()
       } else {
         if (isRetired) {
           result = retiredAmount()
         } else {
           result = normalAmount()
         }
       }
     }
     return result
   }
   ```

   ```js
   function getPayAmount() {
     if (isDead) {
       return deadAmount()
     }
     if (isSeparated) {
       return separatedAmount()
     }
     if (isRetired) {
       return retiredAmount()
     }
     return normalAmount()
   }
   ```

   </details>

   <details>
   <summary>절차</summary>
   1. 교체해야 할 조건 중 가장 바깥 것을 선택하여 보호 구문으로 바꾼다.
   2. 테스트
   3. 1~2반복
   4. 모든 보호 구문이 같은 결과를 반환한다면 보호 구문들의 조건식을 통합
   </details>

   - 논의 사항
     - !(a > 0 && b > 0 && c > 0), a <= 0 || b <=0 || c <=0

4. 조건부 로직을 다형성으로 바꾸기

   > 로직을 구조화하여 명확하게 만들 수 있다.

   - 논의 사항
     - 팩토리 함수: https://ui.toast.com/weekly-pick/ko_20160905/

5. 특이 케이스 추가하기

- 특수한 경우의 공통 동작을 한곳에 모으자.

- 리팩터링 과정에서 코드를 일괄적으로 바꿔야 한다면 해당 함수에 에러처리 구문을 넣어, 실수가 있는지 확인하자.

- 특이 케이스의 경우라면 특이 케이스 객체를 반환하여 기본값 처리를 하자.

-  데이터 구조를 변환하는 함수
    - enrich: 부가 정보 추가
    - transform :형태를 바꾸는 경우

   
> 특수한 경우의 공통 동작을 한곳에 모으자.

   ```
  const site = acquireSiteData();
  const aCustomer = site.customer;
  if(aCustomer === '미확인 고객') // 1. 반복되는 검사 케이스 확인
    
    
  function isUnknown(aCustomer){
      return aCustomer === '미확인 고객'
  } // 2. 함수로 추출

  // 3. 객체 자체에 unKnown 관련 정보와 특이케이스일 때의 정보를 삽입
  function enrichSite(site){
    const result = _.cloneDepp(site)
    
    if(isUnknown(result.customer)){
      result.customer = unknownCustomer 
    }
  }

// 4. 클라이언트(게스트)에서는 비교 구문 없이 참조만으로도 특이케이스일 때의 정보가 나옴.
   
   ```

6. 어서션 추가하기

- 항상 참이라고 가정하는 조건부 문장
- 오류 찾기에 활용 가능
- 특정 로직이 실행 될 때 필요한 프리컨디션을 나타냄 

```
applyDiscount(aNumber){
    return aNumber - (this.discountRate * aNumber);
} // 1. discountRate는 항상 양수라는 가정이 깔려 있음.

assert(this.discountRate >= 0) // 2. 이런 어서션을 추가 할 수 있다.
// 3. 필요하다면 discountRate의 게터에 추가도 가능하다.
// 4. '반드시 참이어야 하는 것' 에 달자.
```

7. 제어 플래그를 탈출문으로 바꾸기

- 반복문을 작성하다보면 isFind 같은 제어 플래그를 사용하는 경우가 있다.
- 이런 친구들은 삭제하고 break, return 으로 해당 반복문을 끝내도록 하자.
- 물론 이러기 위해서는 작게 추출되어야 하는 작업이 선행되어야 한다.

```
let found = false;
for(name in list){
  if(name === '기원'){
    found = true // 제어 플래그
  }

  if(found){
    // 제어 플래그에 의해 제어되는 반복문 내부 코드
  }
}
