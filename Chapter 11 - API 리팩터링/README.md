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


