
function validatePassword(){

}

function store(){

    const checked = [];
    $('#register-form input[name="games"]:checked').each(function () {
        checked.push($(this).val());
    });

    const user = {
      username:  $("#username").val(),
      password: $("#pw").val(),
      email: $("#email").val(),
      gender:  $('#register-form input[type=radio]:checked').val(),
      country: $('#country').val(),
      games: checked,
      proficiency: $('#proficiency').val(),
    };


    const callback = $.ajax({
        url: 'http://localhost:3000/api/test',
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(user),
        processData: false,
        success: function () {

        },
        error: function () {
            console.log("Error")
        },
    });

}

function check() {

    const enteredUser = {
        username: $("#usrname").val(),
        password: $("#userPw").val(),
    };

    $.ajax({
        url: 'http://localhost:3000/api/login',
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(enteredUser),
        processData: false,
        success: function (response, textStatus, jqXHR) {
            if(response === true){
                logIn(enteredUser);
            }
            else{
                alert('Invalid username or password');
            }
        },
        error: function () {
            console.log("Error")
        },
    });

}

function logIn(user){
    localStorage.setItem("user", user.username);
    $('#registration').hide();
    $('#login').hide();
    $('#loggedIn').show();
    $('.loggedUser').html(user.username);
}