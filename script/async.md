# 자바스크립트 비동기 처리: async와 await

비동기는 자바스크립트의 핵심이자 가장 어려운 부분 중 하나입니다.

## 1. 비동기가 왜 필요한가요?
자바스크립트는 싱글 스레드로 동작합니다. 오래 걸리는 작업을 기다리면 화면이 멈추기 때문입니다.

## 2. Promise의 등장
### 2-1. 콜백 지옥
과거에는 콜백 함수를 중첩하여 사용했습니다. 코드가 오른쪽으로 계속 길어지는 현상이 발생했죠.

### 2-2. Promise 객체
Promise는 비동기 작업의 '성공' 또는 '실패'를 나타내는 객체입니다.

```javascript
const promise = new Promise((resolve, reject) => {
  // 비동기 작업
  resolve("성공!");
});
```

## 3. async와 await 문법
ES8(ES2017)에서 추가된 이 문법은 Promise를 동기 코드처럼 읽히게 만듭니다.

### 3-1. async 키워드
함수 앞에 붙이면 무조건 Promise를 반환합니다.

### 3-2. await 키워드
Promise가 해결(resolved)될 때까지 기다립니다.

```javascript
async function getData() {
  try {
    const response = await fetch('https://api.example.com');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

## 4. 예외 처리
`try-catch` 구문을 사용하여 에러를 안전하게 처리할 수 있습니다.

## 5. 결론
async/await는 비동기 코드를 작성할 때 가장 추천하는 방식입니다. 가독성이 매우 뛰어납니다.
