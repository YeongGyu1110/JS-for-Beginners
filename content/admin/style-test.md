# 스타일 테스트 (Style Test)

> [!CAUTION]
> **ADMINISTRATOR ONLY**\
> 이 페이지는 시스템 관리자 및 개발자의 테스트용 공간입니다. 
> 마크다운 렌더링 품질과 CSS 스타일을 점검하기 위한 테스트용 문서입니다. 실제 콘텐츠가 아닌, 모든 마크다운 요소가 의도한 대로 표시되는지 확인하는 용도로 사용하세요.

---

## 1. 텍스트 스타일 (Text Formatting)

다양한 방법으로 텍스트를 강조할 수 있습니다.

- **굵게 (Bold)**: `**텍스트**` 또는 `__텍스트__`
- *기울임 (Italic)*: `*텍스트*` 또는 `_텍스트_`
- ***굵고 기울임 (Bold & Italic)***: `***텍스트***`
- ~~취소선 (Strikethrough)~~: `~~텍스트~~`
- <u>밑줄 (Underline)</u>: `<u>텍스트</u>` (HTML 태그 사용)
- `인라인 코드 (Inline Code)`: `` `코드` ``

---

## 2. 목록 (Lists)

### 2.1. 순서가 없는 목록
- 첫 번째 항목
  - 서브 항목 A
  - 서브 항목 B
- 두 번째 항목
- 세 번째 항목

### 2.2. 순서가 있는 목록
1. 첫 번째 단계
2. 두 번째 단계
   1. 하위 단계 1
   2. 하위 단계 2
3. 세 번째 단계

### 2.3. 체크리스트 (Task Lists)
- [x] 완료된 작업
- [ ] 진행 중인 작업
- [ ] 예정된 작업

---

## 3. 인용문 (Blockquotes)

> 마크다운은 텍스트 기반의 마크업 언어로, 일반 텍스트 문서의 양식을 편집하는 데 쓰입니다.
>> 중첩된 인용문도 사용 가능합니다.
>> - *작성자 미상*

---

## 4. 코드 블록 (Code Blocks)

언어별 문법 강조(Syntax Highlighting)를 지원합니다.

### JavaScript
```javascript
const greeting = "Hello, World!";
function sayHello(name) {
  console.log(`${greeting} My name is ${name}.`);
}
sayHello("Gemini");
```

### CSS
```css
body {
  background-color: #f0f0f0;
  font-family: 'Pretendard', sans-serif;
}
.highlight {
  color: #ff0000;
  font-weight: bold;
}
```

---

## 5. 표 (Tables)

데이터를 구조적으로 표현할 때 유용합니다. 정렬 옵션도 포함합니다.

| 이름 | 역할 | 상태 | 정렬 테스트 |
| :--- | :---: | ---: | :--- |
| **Gemini** | AI 어시스턴트 | 활성 | 왼쪽 정렬 |
| **User** | 개발자 | 학습 중 | 중앙 정렬 |
| **Markdown** | 포맷 | 완벽 | 오른쪽 정렬 |

---

## 6. 링크 및 이미지 (Links & Images)

### 링크 (Link Style Test)
- [이것은 내부 링크입니다 (Markdown Guide)](./markdown-guide.md)
- [이것은 외부 링크입니다 (Google)](https://www.google.com)
- 본문 텍스트 내의 [하이퍼링크](https://google.com) 스타일이 `var(--accent-color)`를 사용하며 점선 밑줄이 있는지 확인하세요.

### 이미지
![Placeholder Image](../sign.jpg)
*이미지 캡션: 샘플 이미지입니다.*

---

## 7. 수학 공식 (Mathematical Expressions)

LaTeX 문법을 사용하여 수식을 작성할 수 있습니다. (렌더러 지원 필요)

- 인라인 수식: $E = mc^2$
- 블록 수식:
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

---

## 8. 특수 요소 및 안내 (Callouts / Admonitions)

GitHub 및 Obsidian 스타일의 안내창 기능을 지원합니다. `blockquote` 문법 내에 `[!TYPE]` 형식을 사용합니다.

> [!NOTE]
> **참고:** 일반적인 정보를 전달할 때 사용합니다. (Blue)

> [!TIP]
> **팁:** 유용한 팁이나 권장 사항을 안내할 때 사용합니다. (Green)

> [!IMPORTANT]
> **중요:** 놓치지 말아야 할 핵심 내용을 강조할 때 사용합니다. (Purple)

> [!WARNING]
> **주의:** 잠재적인 위험이나 오류 가능성을 경고할 때 사용합니다. (Yellow)

> [!CAUTION]
> **경고:** 데이터 손실이나 심각한 문제를 방지하기 위한 강력한 경고입니다. (Red)

---

## 9. 각주 (Footnotes)

문장 끝에 각주를 달 수 있습니다.[^1]

[^1]: 이것은 각주에 대한 설명입니다.

---

## 10. 수평선 (Horizontal Rules)

---
***
___

마지막까지 읽어주셔서 감사합니다!
