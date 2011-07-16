$("#fb-login").css("display","none");

FB.init({
  appId  : '205668742817032',
  status : true, // check login status
  cookie : true, // enable cookies to allow the server to access the session
  xfbml  : true  // parse XFBML
});
FB.getLoginStatus(function(response) {
  if (response.session) {
    // logged in and connected user, someone you know
    FB.api('/me', function(user) {
      alert(user['name'] + " is logged in");
    });
  } else {
    // no user session available, someone you dont know
    $("#fb-login").css("display","block");
  }
});

//Actions to take upon the user logging in
FB.Event.subscribe('auth.login', function(response) {
  if(response.session) {

    $("#fb-login").css("display","none");

    FB.api('/me', function(user) {
      alert(user["name"] + " is logged in!");
    });
  }
});
