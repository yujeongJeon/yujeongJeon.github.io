## 논의 사항

- 중첩함수  
  285p에서 중첩함수는 되도록 만들지 말라고 언급
- 객체에서의 파이프라인

```javascript
class Car {
constructor() {
    this.make = 'Honda'
    this.model = 'Accord'
    this.color = 'white'
}

setMake(make) {
    this.make = make
    // 메모: 체이닝을 위해 this를 리턴합니다.
    return this
}

setModel(model) {
    this.model = model
    // 메모: 체이닝을 위해 this를 리턴합니다.
    return this
}

setColor(color) {
    this.color = color
    // 메모: 체이닝을 위해 this를 리턴합니다.
    return this
}

save() {
    console.log(this.make, this.model, this.color)
    // 메모: 체이닝을 위해 this를 리턴합니다.
    return this
}
}
const car = new Car()
.setColor('pink')
.setMake('Ford')
.setModel('F-150')
.save()
```
> [클린코드 - 메소드체이닝](https://github.com/qkraudghgh/clean-code-javascript-ko#%EB%A9%94%EC%86%8C%EB%93%9C-%EC%B2%B4%EC%9D%B4%EB%8B%9D%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EC%84%B8%EC%9A%94)

