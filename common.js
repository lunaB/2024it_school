$(document).ready(function() {
  // Login form submission
  $('#login').submit(function(event) {
    event.preventDefault();
    const formData = {
      id: $('input[name="id"]').val(),
      pw: $('input[name="pw"]').val()
    };

    $.ajax({
      type: 'POST',
      url: '/api/login', // Adjust the URL to your login endpoint
      data: JSON.stringify(formData),
      contentType: 'application/json',
      success: function(response) {
        // Handle successful login
        alert('로그인 성공!');
        window.location.href = 'index.html'; // Redirect to main page
      },
      error: function(error) {
        // Handle login error
        alert('로그인 실패: ' + error.responseText);
      }
    });
  });

  // Register form submission
  $('#register').submit(function(event) {
    event.preventDefault();
    const formData = {
      id: $('input[name="id"]').val(),
      user_name: $('input[name="user_name"]').val(),
      pw: $('input[name="pw"]').val(),
      pw_re: $('input[name="pw_re"]').val()
    };

    if (formData.pw !== formData.pw_re) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    $.ajax({
      type: 'POST',
      url: '/api/register', // Adjust the URL to your register endpoint
      data: JSON.stringify(formData),
      contentType: 'application/json',
      success: function(response) {
        // Handle successful registration
        alert('회원가입 성공!');
        window.location.href = 'login.html'; // Redirect to login page
      },
      error: function(error) {
        // Handle registration error
        alert('회원가입 실패: ' + error.responseText);
      }
    });
  });
});