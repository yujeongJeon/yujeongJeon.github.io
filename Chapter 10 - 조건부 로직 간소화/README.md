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
