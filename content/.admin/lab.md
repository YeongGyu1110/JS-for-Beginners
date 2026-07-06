# 실습 테스트

> [!CAUTION]
> **ADMINISTRATOR ONLY**\
> 이 페이지는 시스템 관리자 및 개발자의 테스트용 공간입니다. 
> 실습 기능을 테스트하고 점검하기 위한 테스트용 문서입니다. 실제 콘텐츠가 아닌, 실습 전용 요소가 올바르게 동작되는지 확인하는 용도로 사용하세요.

---

## 01. 변수 선언하기
자바스크립트에서 `let`과 `const`를 사용해 변수를 선언할 수 있습니다. 브라우저 콘솔(F12)을 열어 아래 코드를 작성해보세요.

```javascript
let myName = "Explorer";
const isReady = true;

console.log(myName, isReady);
```

<button class="lab-task-btn">
    <span class="status-box">[ ]</span>
    <span class="task-text">코드 작성 후 콘솔에 값이 정상 출력되는 것을 확인했습니다.</span>
</button>

## 02. 조건문 흐름 이해
변수의 값에 따라 다른 결과를 출력하는 흐름 제어문입니다.

```javascript
if (isReady) {
    console.log("우주선 발사 준비 완료!");
} else {
    console.log("아직 준비되지 않았습니다.");
}
```

<button class="lab-task-btn">
    <span class="status-box">[ ]</span>
    <span class="task-text">if-else 구문의 동작 원리를 이해했습니다.</span>
</button>

## 03. 오류(Error) 확인하기
일부러 오류를 내보고 에러 메시지를 읽는 연습을 해봅시다. 상수로 선언된 `isReady`에 새로운 값을 할당해보세요.

```javascript
isReady = false; // TypeError 발생
```

<button class="lab-task-btn">
    <span class="status-box">[ ]</span>
    <span class="task-text">Uncaught TypeError 메시지를 직접 확인했습니다.</span>
</button>
