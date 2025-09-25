const productPrice = 50000; // 상품 가격 (이 값은 변하지 않아야 함)
const shippingFee = 3000;   // 배송비 (이 값도 변하지 않아야 함)

// '+' 연산자로 '최종 결제 금액'이라는 새로운 결과를 계산
const finalPayment = productPrice + shippingFee;

console.log("상품 가격:", productPrice);
console.log("배송비:", shippingFee);
console.log("최종 결제 금액:", finalPayment); // 53000




var cartTotal = 0; // 장바구니의 초기 금액은 0원
console.log("처음 장바구니:", cartTotal, "원"); // 0

// 1. 셔츠(30000원)를 담음
cartTotal += 30000;
console.log("셔츠 담은 후:", cartTotal, "원"); // 30000

// 2. 바지(50000원)를 또 담음
cartTotal += 50000;
console.log("바지 담은 후:", cartTotal, "원"); // 80000