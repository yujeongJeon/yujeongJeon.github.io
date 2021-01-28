#### 1. 메서드 올리기

A가 C를 상속

B가 C를 상속

A와 B에 getName()이 있다면?

C에 getName()을 놓고 A, B에선 Override

Duck Typing

- 오리처럼 생기고 울면 오리로 간주하겠다.
- 이 클래스가 실제로 어떻게 생겨먹었는지 모르겠지만 getName()이 있으면 C로 간주하겠다. (C에는 getName()만 abstract 라고 가정)
- 굉장히 유용한 기법으로 일부 정적 언어에서도 (C#) Duck Typing 기법을 제공 (dynamic)

1. 정적 언어에서는 메서드 올리기 이전에는 C로 받고 getName() 호출 불가능

```
C a = new A()
C b = new B()
a.getName() // Compile Error
b.getName() // Compile Error
```

2.  동적 언어에서는 메서드 올리기를 하지 않아도 getName() 호출 가능

```
const a = new A() // A a = new A()
const b = new B() // B b = new B()
a.getName()
b.getName()
```

3.  정적 언어에서는 서로 다른 두 클래스를 리스트 등 자료 구조에 한번에 담을 때 상속이 유용

```
List<C> list = new ArrayList<>();
list.add(a);
list.add(b);
list.get(0).getName() // Compile Error
```

4.  동적 언어에서는 모든게 Object (Any) 이므로 굳이...

```
const list = []
list.push(a);
list.push(b);
list[0].getName()
```

JavaScript 보다 Java에 적합한 리팩토링

JavaScript 에서는 C를 상속하는 모든 클래스의 getName()의 메서드 내용이 100%
일치할때 쓸만한 기법

그게 아니라면 Duck Typing으로 인하여 굳이 할 필요 없음

### 2. 필드 올리기

메서드 올리기와 유사

필드는 Override가 불가능

private을 부모 클래스에 올렸으므로 접근 제한자를 protected로 설정

JavaScript는 해당 사항 없음

### 3. 생성자 본문 올리기

A 클래스의 속성: a

B 클래스는 A 클래스를 상속하고 고유 속성: b, c

A 클래스의 전체 속성: a

B 클래스의 전체 속성: a, b, c

B 클래스를 생성할 때 속성 a의 초기화는 A 클래스에서 하자

### 4. 메서드 내리기

부모 클래스 Human

자식 클래스 Student, Teacher

Human (부모) 클래스의 getSalary() 메서드 (X)

Teacher 클래스에 getSalary()를 내리기

다만... 이런 경우에는?

```
getTotalSalaryOfSchool() {
    return humans.Sum(Human::getSalary)
}
```

Student가 논리적으로 봉급을 받진 않지만 0으로 취급하는게 편리함

### 5. 필드 내리기

메서드 올리기 : 필드 올리기 = 메서드 내리기 : 필드 내리기

메서드 내리기: private => protected

필드 내리기: protected => private

### 6. 타입 코드를 서브 클래스로 바꾸기

```
// Before
Smartphone(osType, name) // ctor

Smartphone("Android", "My Galaxy")
Smartphone("iOS", "My iPhone")
Smartphone("Windows Phone", "Lumia 1020")
Smartphone("Windows Moblie", "HTC HD2")

// After
Smartphone(name) // ctor

AndroidSmartphone("My Galaxy")
IOSSmartphone("My iPhone")
WindowsPhoneSmartphone("Lumia 1020")
WindowsMobileSmartphone("HTC HD2")

AndroidSmartphone extends Smartphone
IOSSmartphone extends Smartphone
WindowsPhoneSmartphone extends Smartphone
WindowsMobileSmartphone extends Smartphone
```

### 7. 서브 클래스 제거하기

6번과 반대

오버라이드된 메서드가 바깥에서 다양한 일을 한다면 6번

그렇지 않고 내부 (상위 클래스)에서만 일을 한다면 7번

### 8. 슈퍼 클래스 추출하기

1번 메서드 올리기와 유사

### 9. 계층 합치기

Salesperson extends Employee

모든 Employee가 Salesperson 일 때 굳이 Employee를 Base Class로 둘 필요가 없음

### 10. 서브 클래스를 위임으로 바꾸기

상속 대신 위임을 사용

상속의 단점

- 한번만 상속 가능 (다중 상속 불가능)
- 부모 클래스에서 필요로 하지 않는 기능들을 자식 클래스가 물려받게 됨?
  (하지만 이것은 IS-A 관계가 아니므로 상속을 잘못 적용한 예)

  대표적인 리팩토링 기법으로 전략 패턴이 있음

```

Dog() {
    bark();
    eat();
} // 부모 클래스

RobotDog() {
    bark() { // 왈왈 }
    eat() { // 안먹어 }
}

DollDog() {
    bark() { // 안짖어 }
    eat() { // 안먹어 }
}

Husky() {
    bark() { // 왕왕 }
    eat() { // 먹먹 }
}

Maltese() {
    bark() { // 알알 }
    eat() { // 먹먹 }
}

Pomeranian() {
    bark() { // 알알 }
    eat() { // 먹먹 }
}

```

- 안먹어 2번 중복

- 알알 2번 중복

- 먹먹 3번 중복

상속으로 인하여 동일한 동작을 하는 코드 중복 발생

```

Dog() {
bark() { barkBehavior.bark(); }
eat() {eatBrhavior.eat(); }

    Dog(BarkBehavior b, EatBehavior e) {
        this.barkBehavior = b;
        this.eatBehavior = e;
    }

}

BarkBehavior() // 짖는 행동 기본 클래스
AlAlBehavior() // 알알

EatBehavior() // 먹는 행동 기본 클래스
NoEatBehavior() // 안먹음
MukMukBehavior() // 먹먹

```

### 11. 슈퍼 클래스를 위임으로 바꾸기

Java의 문제 공감

Stack이 List를 상속 = get(index) 함수가 외부로 노출됨

```

throw new NotImplementedException() // 메서드가 구현되지 않음을 런타임에 명시적으로 알려줌?
return this.storage[index] // 스택의 본질을 무시하고 기술적으로 가능은 하니 동작을 함?

```

C#은 Stack은 List를 상속하지 않음

Pop, Push만 가능

Stack이 List를 상속하기보단, Stack 내부에서 List를 생성

- List: getAt, setAt, add, removeAt

- Stack: pop, push

```

Stack<T> extends List<T>
Stack<T> s; // s.getAt(), s.setAt(), add(), removeAt()
// 이것이 과연 스택인가?

```

```

Stack<T> {
List<T> storage

    pop() {
        storage.getAt(storage.length - 1);
        storage.removeAt(storage.length - 1)
    }

    push(data) {
        storage.add(data);
    }

}

```
