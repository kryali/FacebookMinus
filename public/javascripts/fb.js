FB.init({
  appId  : '205668742817032',
  status : true, // check login status
  cookie : true, // enable cookies to allow the server to access the session
  xfbml  : true  // parse XFBML
});

function fb_login(){·
  FB.getLoginStatus(function(response) {
    if(response.session) {
      FB.api('/me', function(user) {
        if(user != null) {
          console.log(user);
        }
      });
    }
  });

  //Actions to take upon the user logging in
  FB.Event.subscribe('auth.login', function(response) {
    if(response.session) {
      FB.api('/me', function(user) {
       if(user != null) {
          console.log(user);
        }
      });
    } else {
      //Login failed??
    }
  });
}
