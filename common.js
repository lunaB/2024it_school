$(document).ready(function() {

  let host = 'http://192.168.202.21:8080';

  // 로그인
  $('#login').submit(function(event) {
    event.preventDefault();

    console.log($('input[name="username"]').val())

    const formData = {
      username: $('input[name="username"]').val(),
      password: $('input[name="password"]').val()
    };
    $.ajax({
      method: 'POST',
      url: host+'/v1/auth/login',
      data: JSON.stringify(formData),
      contentType: 'application/json',
      success: function(response) {
        // Handle successful login
        alert('로그인 성공');
        // 유저 정보 저장
        console.log(response)

        sessionStorage.setItem('username', $('input[name="username"]').val()); // Save username in session storage
        
        window.location.href = 'game.html'; // Redirect to main page
      },
      error: function(error) {
        // Handle login error
        alert('로그인 실패: ' + error.responseText);
      }
    });
  })

  // 회원가입
  $('#register').submit(function(event) {
    event.preventDefault();
    const formData = {
      username: $('input[name="username"]').val(),
      password: $('input[name="password"]').val(),
    };

    if (formData.pw !== formData.pw_re) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    $.ajax({
      type: 'POST',
      url: host+'/v1/auth/new-user',
      data: JSON.stringify(formData),
      contentType: 'application/json',
      success: function(response) {
        alert('회원가입이 완료되었습니다.');
        window.location.href = 'login.html';
      },
      error: function(error) {
        // Handle registration error
        alert('회원가입 실패: ' + error.responseText);
      }
    });
  })
})
