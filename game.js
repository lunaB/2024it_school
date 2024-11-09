$(document).ready(function () {

  // if (window.appData) {
  //     console.log(window.appData)
  // }
  const host = 'http://localhost';
  const port = '8080';

  const keySets = {
      shallow: [
          ["ArrowUp", "ArrowRight", "ArrowDown"],
          ["ArrowLeft", "ArrowRight", "ArrowUp"],
          ["ArrowDown", "ArrowUp", "ArrowLeft"]
      ],
      thermocline: [
          ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"],
          ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"],
          ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "ArrowDown"]
      ],
      deep: [
          ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"],
          ["ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"],
          ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowUp", "ArrowRight"]
      ]
  };

  let gameActive = false;
  let difficulty = window.appData.fishing_rods.find(rod => rod.equipped === 1).grade || "thermocline";
  let selectedKeys = keySets[difficulty];
  let requiredKeys = selectedKeys[Math.floor(Math.random() * selectedKeys.length)];

  let currentKeyIndex = 0;
  let gauge = 0;
  const timeLimit = 5000; // 총 제한 시간 5초
  const timePerKey = 1000; // 키당 1초
  let intervalId;

  // 게임 닫기
  $('#close-game-button').click(function (evnt) {
      $('#game').css('display', 'none');
      endGame();
  })

  // 게임 실행 함수
  $('#game-start-button').click(function (event) {
      startGame()
  });

  function startGame() {

      

      // 낚시 동작
      app.cat = 'fishing2';

      console.log(1);
      $('#game').css('display', 'block');
      gameActive = true;
      currentKeyIndex = 0;
      gauge = 0;
      updateProgress();
      showNextKey();
      $(document).on("keydown", handleKeyPress);

      let elapsed = 0;

      intervalId = setInterval(() => {
          elapsed += timePerKey;

          if (elapsed >= timeLimit) {
              clearInterval(intervalId);
              failGame();
              endGame();
          }
      }, timePerKey);
  }

  // 시간 카운트 다운 리셋 + keydown 이벤트 제거
  function endGame() {
      gameActive = false;
      clearInterval(intervalId);
  }
  
  function handleKeyPress(event) {
      if (!gameActive) return;
      
      if (event.key === requiredKeys[currentKeyIndex]) {
          gauge += 100 / requiredKeys.length; // 게이지 증가
          updateProgress();
          currentKeyIndex++;

          // 모든 키 입력이 완료되면 게이지가 100%로 채워짐
          if (currentKeyIndex === requiredKeys.length) {
              clearInterval(intervalId); // 타이머 중지
              successGame();
              endGame();
          } else {    
              showNextKey(); // 다음 키로 넘어가기
          }
      }
  }
  // 현재 키를 화면에 표시
  function showNextKey() {
      if (currentKeyIndex < requiredKeys.length) {
          const imagePath = `resource/arrowkeys/${requiredKeys[currentKeyIndex]}.png`
          $("#current-key").attr("src", imagePath);
      }
  }

  // 게이지 업데이트
  function updateProgress() {
      console.log("update")
      console.log(gauge)
      $(".progress").attr("value", `${gauge}`);
  }

  // 낚시 성공
  // POST /v1/game/success

  function successGame() {
      const username = sessionStorage.getItem('username');
      showGameResult(true)

      $.ajax({
      url: host+":"+port+'/v1/game/success',
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          data: JSON.stringify({ username: username }),
          success: (response) => {
              if (response.success) {
                  console.log('Game success recorded successfully');
              } else {
                  console.error('Failed to record game success');
              }

              // 성공동작
              this.cat = "fishing3";
          },
          error: (error) => {
              console.error('Error recording game success:', error);
          }
      });
  }

  // 낚시 실패
  // POST /v1/game/fail
  function failGame() {
      const username = sessionStorage.getItem('username');
      showGameResult(false)
      $.ajax({
          url: host+":"+port+'/v1/game/fail',
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          data: JSON.stringify({ username: username }),
          success: (response) => {
              if (response.success) {
                  console.log('Game fail recorded successfully');
              } else {
                  console.error('Failed to record game fail');
              }

              // 실패동작
              this.cat = "fishing4";
          },
          error: (error) => {
              console.error('Error recording game fail:', error);
          }
      });
  }

  function showGameResult(boolResult) {
      let resultText
      if (boolResult) {
          resultText = "낚시 성공"
      } else {
          resultText = "낚시 실패"
      }
      $("#game-result-overlay").css("display", 'flex');
      $('#game-result-content p').text(resultText);
  }

  $('#replay-fishing-game').click(function (evnt) {
      $("#game-result-overlay").css("display", 'none');
      startGame();
  })

  $('#finish-fishing-game').click(function (evnt) {
      $("#game-result-overlay").css("display", 'none');
      $('#game').css('display', 'none');
      $("#id").css("display", 'none');
  })
});

