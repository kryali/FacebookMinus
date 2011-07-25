var sep = "&nbsp;&nbsp;-&nbsp;&nbsp;";
$("#fb-login").css("display","none");

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

FB.init({
  appId  : '205668742817032',
  status : true, // check login status
  cookie : true, // enable cookies to allow the server to access the session
  xfbml  : true  // parse XFBML
});
FB.getLoginStatus(function(response) {
  if (response.session) {
    init();
    // logged in and connected user, someone you know
  } else {
    // no user session available, someone you dont know
    $("#fb-login").css("display","block");
  }
});

//Actions to take upon the user logging in
FB.Event.subscribe('auth.login', function(response) {
  if(response.session) {
    $("#fb-login").css("display","none");
    init();
  }
});

/* parseFeedItem returns a list feed item */
var parseFeedItem = function(data) {
  var feedPost = document.createElement("li");

  /* Profile image */
  var profileImage = document.createElement("img");
  profileImage.setAttribute("src", "http://graph.facebook.com/"+ data['from']['id'] + "/picture" );

  /* Add them to the list item */
  feedPost.appendChild(profileImage);
  feedPost.appendChild(parsePostContents(data));

  console.log(feedPost);
  return feedPost;
}

var parsePostContents = function(data){
  var postContents = document.createElement("div");
  postContents.setAttribute("id", "postContents");

  postContents.appendChild(parsePostHeader(data));
  postContents.appendChild(parsePostBody(data));

  return postContents;
}

function parsePostBody(data){

  /* Message */
  var message;
  if( (data['message']) != undefined){
    message = document.createElement("span");
    message.className = "message";
    message.innerHTML = data['message'];
  }

  var postBody = document.createElement("div");
  if( (data['message']) != undefined)
    postBody.appendChild(message);
  return postBody;
}

function parsePostHeader(data){
  /* Header */
  /* Name */
  var name = document.createElement("a");
  name.className = "name";
  name.innerHTML = data['from']['name'];
  name.setAttribute("href", "http://facebook.com/profile.php?id=" + data["from"]["id"]);

  /* Time */
  var date = formatFBTime(data['created_time']);
  date = feedTime(date);

  var headerSubText = document.createElement("span");
  headerSubText.className = "header grey";
  headerSubText.innerHTML = sep + date;
  headerSubText.innerHTML += sep + data["type"].capitalize();

  /* Build up the header */
  var postHeader = document.createElement("div");
  postHeader.setAttribute("id", "postHeader");
  postHeader.appendChild(name);
  postHeader.appendChild(headerSubText);

  return postHeader;
}

function feedTime(date) {
  var hours = date.getHours();

  var clock = "AM";
  if(hours >= 12 && hours != 24){
    clock = "PM";
  }
  if(hours > 12) {
    hours -= 12;
  }

  var minutes = date.getMinutes();
  if(minutes < 10)
    minutes = "0" + minutes;
  return hours + ":" + minutes + " " + clock;
}

function formatFBTime(fbDate){
  var arrDateTime = fbDate.split("T"); 
  var arrDateCode = arrDateTime[0].split("-");
  var strTimeCode = arrDateTime[1].substring(0,  arrDateTime[1].indexOf("+")); 
  var arrTimeCode = strTimeCode.split(":"); 
  var valid_date = new Date()
  valid_date.setUTCFullYear(arrDateCode[0]);
  valid_date.setUTCMonth(arrDateCode[1] - 1);
  valid_date.setUTCDate(arrDateCode[2]);
  valid_date.setUTCHours(arrTimeCode[0]);
  valid_date.setUTCMinutes(arrTimeCode[1]);
  valid_date.setUTCSeconds(arrTimeCode[2]);
  return valid_date;
}

var initFeed = function(){
  FB.api('/me/home', function(feed){
    for( var i = 0; i < feed['data'].length; i++){
      var feedItem = feed['data'][i];
//      $("#feed").appendChild(parseFeedItem(feedItem));
      console.log(feedItem);
      document.getElementById("feed").appendChild(parseFeedItem(feedItem));
    }
  });
}

var init = function(){
  initFeed();
};
