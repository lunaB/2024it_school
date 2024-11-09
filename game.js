$(document).ready(function () {

    let host = 'http://192.168.202.21:8080';

    const keySets = {
        easy: [
          ["ArrowUp", "ArrowRight", "ArrowDown"],
          ["ArrowLeft", "ArrowRight", "ArrowUp"],
          ["ArrowDown", "ArrowUp", "ArrowLeft"]
        ],
        medium: [
          ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"],
          ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"],
          ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "ArrowDown"]
        ],
        hard: [
          ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"],
          ["ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"],
          ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowUp", "ArrowRight"]
        ]
      };

    let difficulty = "medium";
    let selectedKeys = keySets[difficulty] || keySets["medium"];
    let requiredKeys = selectedKeys[Math.floor(Math.random() * selectedKeys.length)];
    
    let currentKeyIndex = 0;
    let gauge = 0;
    const timeLimit = 15000; // 총 제한 시간 15초
    const timePerKey = 1000; // 키당 1초
    let intervalId;


    // 게임 닫기
    $('#close-game-button').click(function (evnt) {
        $('#game').css('display', 'none');
    })

    // 게임 실행 함수
    $('#game-start-button').click(function (event) {
        // 낚시 동작
        app.cat = 'fishing2';
        
        console.log(1);
        $('#game').css('display', 'block');
        showNextKey();
        let elapsed = 0;

        intervalId = setInterval(() => {
            elapsed += timePerKey;

            if (elapsed >= timeLimit) {
                clearInterval(intervalId);
                failGame();
                $(document).off("keydown"); // 키 입력 이벤트 제거
            }
        }, timePerKey);
    });

    // 서버에서 requiredKeys 가져오기
    function fetchRequiredKeys() {
        
    }

    // 현재 키를 화면에 표시
    function showNextKey() {
        if (currentKeyIndex < requiredKeys.length) {
            $("#current-key").text(`Press: ${requiredKeys[currentKeyIndex]}`);
        }
    }

    // 게이지 업데이트
    function updateProgress() {
        $(".progress").css("width", `${gauge}%`);
    }

    // 키 입력 성공 시 진행
    $(document).keydown(function (event) {
        if (event.key === requiredKeys[currentKeyIndex]) {
            gauge += 100 / requiredKeys.length; // 게이지 증가
            updateProgress();
            currentKeyIndex++;

            // 모든 키 입력이 완료되면 게이지가 100%로 채워짐
            if (currentKeyIndex === requiredKeys.length) {
                clearInterval(intervalId); // 타이머 중지
                successGame();
            } else {
                showNextKey(); // 다음 키로 넘어가기
            }
        }
    });


});

