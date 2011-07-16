FB.init({
  appId  : '205668742817032',
  status : true, // check login status
  cookie : true, // enable cookies to allow the server to access the session
  xfbml  : true  // parse XFBML
});
FB.getLoginStatus(function(response) {
  if (response.session) {
    // logged in and connected user, someone you know
    console.log(response);
  } else {
    // no user session available, someone you dont know
    console.log("Not logged in!");
  }
});
