var fruit = "사과";

switch (fruit) {
	case "사과":
	case "바나나":
	case "포도":
		console.log("과일입니다.");    // fruit가 '사과', '바나나', '포도' 중 하나일 때 실행
		break;
		
	case "당근":
	case "오이":
		console.log("채소입니다.");    // fruit가 '당근', '오이' 중 하나일 때 실행
		break;
		
	default:
		console.log("알 수 없는 종류입니다.");
		break;
}