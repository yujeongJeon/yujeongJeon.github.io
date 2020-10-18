##### Chapter 07 - 캡슐화

- 캡슐화의 개요
  - 캡슐화는 정보 은닉의 기본
  - 보여줘야 할 것 (Interface)과 보여주면 안되는 것 (Private)를 분리하여 사용하는 입장에서 복잡성 감소 및 안정성 향상

1. 레코드 캡슐화하기
   - 데이터 레코드는 정의하고 사용하기 간단하지만 계산해서 얻을 수 있는 값 (Computed Value)와 그렇지 않은 값을 명확히 구분해야 하는 단점이 있다.
   - 따라서, 클래스로 레코드를 묶는다면 Class의 Getter를 통하여 값을 구분하는데 도움이 될 수 있다.

```
    const myWaterCart = { price: 1500, amount: 5}
    const totalPrice = myWaterCart.price * myWaterCart.amount
```

```
    class Cart {
        constructor(data) {
            this._price = data.price;
            this._amount = data.amount;
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

    const myWaterCart = new Cart({ price: 1500, amount: 5})
    const totalPrice = myWaterCart.totalPrice
```

2. 컬렉션 캡슐화하기
   - 필요한 인터페이스만 노출하자
   - 무분별한 Getter/Setter 보다 Getter할 대상의 필요한 인터페이스 (add, remove, etc.)만 노출

```
    class Refrigerator {
        constructor() {
            this._grocery = [];
        }

        get grocery() {
            return this._grocery;
        }

        set grocery(arg) {
            this._grocery = arg
        }
    }

    // 사실 grocery는 Reference 객체라서 set을 안해도 됩니다.
    const myRefrigerator = new Refrigerator();
    myRefrigerator.grocery(myRefrigerator.grocery.concat("Egg"));

    const myGroceryCabinet = myRefrigerator.grocery;
    myGroceryCabinet.push("Tofu");
    myRefrigerator.grocery(myGroceryCabinet);

    myGroceryCabinet.splice(this._grocery.findIndex(item => item === "Tofu"), 1);
    myRefrigerator.grocery(myGroceryCabinet);
```

```
    class Refrigerator {
        constructor() {
            this._grocery = [];
        }

        addGrocery(grocery) {
            this._grocery.push(grocery);
        }

        removeGrocery(arg) {
            this._grocery.splice(this._grocery.findIndex(item => item === arg), 1);
        }
    }

    const myRefrigerator = new Refrigerator();
    myRefrigerator.addGrocery("Egg");
    myRefrigerator.addGrocery("Tofu");
    myRefrigerator.removeGrocery("Tofu");
```

3. 기본형을 객체로 바꾸기
   - 단순히 String이나 Number로 사용되던 특정 상태를 객체로 바꿉니다.
   - 객체로 바꾸면 함수를 추가할 수 있으므로 상태 비교등을 객체 내부로 캡슐화할 수 있습니다.

```
    const myCpus = [ "Intel Core i7", "Core i5", "AMD RyZen 9" ];

    const myIntelCpus = myCpus.filter(cpu => cpu.startsWith("Intel") || cpu.startsWith("Core"));
```

```
    const myCpus = [
        { name: "Intel Core i7", brand: "Intel" },
        { name: "Core i5", brand: "Intel" },
        { name: "AMD RyZen 9", brand: "AMD" }
    ]

    const myIntelCpus = myCpus.filter(cpu => cpu.brand == "Intel");
```

```
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

4. 임시 변수를 질의 함수로 바꾸기
   - 비즈니스 로직에 있는 계산된 임시 변수를 제거합니다.
   - 계산된 임시 변수는 함수로 캡슐화합니다.

```
    class Status {
        lockFrontDoor() {
            this.front = true;
        }

        unlockFrontDoor() {
            this.front = false;
        }

        lockRearDoor() {
            this.rear = true;
        }

        unlockRearDoor() {
            this.rear = false;
        }

        get frontDoorStatus() {
            return this.front;
        }

        get rearDoorStatus() {
            return this.rear;
        }
    }

    const myDoorStatus = new Status();

    myDoorStatus.lockFrontDoor();
    myDoorStatus.lockRearDoor();
    myDoorStatus.unlockRearDoor();

    if (myDoorStatus.frontDoorStatus && myDoorStatus.rearDoorStatus) {
        console.log("Safe!");
    } else {
        console.log("Unsafe!");
    }
```

```
    class Status {
        {...}

        get isSafe() {
            return this.frontDoorStatus && this.rearDoorStatus;
        }
    }

    const myDoorStatus = new Status();

    {...}

    if (myDoorStatus.isSafe) {
        console.log("Safe!");
    } else {
        console.log("Unsafe!");
    }
```
