var score = 62;
var scoreGrade;      // undefined, 값이 할당되지 않은 상태

if (score >= 90) {
	scoreGrade = "A";
} else if (score >= 75) {
	scoreGrade = "B";
} else if (score >= 65) {
	scoreGrade = "C";
} else if (score >= 50) {
	scoreGrade = "D";
} else {
	scoreGrade = "F";
}

/*
	score가 62일 때,
	첫 번째 조건 "90 이상" false
	두 번째 조건 "75 이상" false
	세 번째 조건 "65 이상" false
	네 번째 조건 "50 이상" true, scoreGrade에 "D" 할당
*/
console.log(`${scoreGrade}등급 입니다!`);      // 따라서 "D등급 입니다!" 출력됨