var sep = "&nbsp;&nbsp;-&nbsp;&nbsp;";
$("#fb-login").css("display","none");

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

FB.init({
	appId  : '237283539637022',
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

var FBProfileImage = function(id){
	return "http://graph.facebook.com/"+ id + "/picture" ;
}

var FBProfileLink = function(id){
	return "http://facebook.com/profile.php?id=" + id;
}

/* parseFeedItem returns a list feed item */
var parseFeedItem = function(data) {
	var feedPost = document.createElement("li");

	/* Profile image */
	var name = document.createElement("a");
	name.setAttribute("href", FBProfileLink(data["from"]["id"]));

	var profileImage = document.createElement("img");
	profileImage.setAttribute("src", FBProfileImage(data["from"]["id"]));
	profileImage.setAttribute("id", "profile-img" );

	name.appendChild(profileImage);
	/* Add them to the list item */
	feedPost.appendChild(name);
	feedPost.appendChild(parsePostContents(data));

	console.log(feedPost);
	return feedPost;
}

var parsePostContents = function(data){
	var postContents = document.createElement("div");
	postContents.setAttribute("id", "postContents");

	postContents.appendChild(parsePostHeader(data));
	postContents.appendChild(parsePostBody(data));
	if( data["actions"] )
		postContents.appendChild(parsePostActions(data));
	if( data["likes"] )
		postContents.appendChild(parsePostLikes(data));
	if( data["comments"] )
		postContents.appendChild(parsePostComments(data));

	return postContents;
}

function parsePostBody(data){
	var postBody = document.createElement("div");
	postBody.setAttribute("id", "body");

	var bodyContents = document.createElement("div");

	/* Link */
	if( data['link'] )
	{
	  bodyContents.setAttribute("id", "bodyContents");
	  var linkHeader = document.createElement("div");
	  linkHeader.setAttribute("id", "bodyHeader");

	  if( data['type'] != "photo"){
		var icon = document.createElement("img");
		icon.setAttribute("src", data["icon"]);
		icon.setAttribute("id", "icon");
		linkHeader.appendChild(icon);
	  }

	  var link = document.createElement("a");
	  link.setAttribute("href", data["link"]);
	  link.innerHTML = data["name"];
	  link.className = "link";
	  linkHeader.appendChild(link);

	  bodyContents.appendChild(linkHeader);

	  if( data['description'] ){
		var linkDescription = document.createElement("p");
		linkDescription.innerHTML = data["description"];
		bodyContents.appendChild(linkDescription);
	  }
	}

  /* Photo */
  var photoLink;
  if( data['picture'] ){
    photoLink= document.createElement("a");
    photoLink.setAttribute("id", "linkIMG");
    photoLink.setAttribute("href", data["link"]);
    var photo = document.createElement("img"); 
    photo.setAttribute("src", data["picture"]);
    photoLink.appendChild(photo);
  }

   if( data['type'] == "link" ){
      if( data['picture'] )
        postBody.appendChild(photoLink);
      postBody.appendChild(bodyContents);
   } else { 
     postBody.appendChild(bodyContents);
      if( data['picture'] )
       postBody.appendChild(photoLink)
   }

  return postBody;
}

function parsePostHeader(data){
  var postHeader = document.createElement("div");
  postHeader.setAttribute("id", "postHeader");
  /* Header */
  /* Name */
  var from = document.createElement("a");
  from.className = "name";
  from.innerHTML = data['from']['name'];
  from.setAttribute("href", FBProfileLink(data["from"]["id"]));
  postHeader.appendChild(from);

   if(data['to']){
      postHeader.innerHTML += " <img src='http://i.imgur.com/SJG7Z.png'/> ";
     var to = document.createElement("a");
     to.className = "name";
     to.innerHTML = data['to']['data'][0]['name'];
     to.setAttribute("href", FBProfileLink(data["to"]["data"][0]["id"]));
     postHeader.appendChild(to);
  }

  /* Time */
  var date = formatFBTime(data['created_time']);
  date = feedTime(date);

  var headerSubText = document.createElement("span");
  headerSubText.className = "header grey";
  headerSubText.innerHTML = sep + date;
  headerSubText.innerHTML += sep + data["type"].capitalize();

  /* Build up the header */
  postHeader.appendChild(headerSubText);

  if( (data['message']) ){
    var message = document.createElement("div");
    message.className = "message";
    message.innerHTML = data['message'];
    postHeader.appendChild(message);
  }

  return postHeader;
}

function parsePostActions(data){
   var postActions = document.createElement("div");
   postActions.setAttribute("id", "postActions");
   var currentAction;
   for(var i = 0; i < data["actions"].length; i++){
      currentAction = data["actions"][i];
      var postAction = document.createElement("a");
      postAction.innerHTML = currentAction["name"];
      postAction.setAttribute("href", currentAction["link"]);
      postActions.appendChild(postAction);
      if( i+1 != data["actions"].length)
         postActions.innerHTML += sep;
   }

   return postActions;
}

var parsePostComments = function(data) {
   var postComments = document.createElement("ul");
   postComments.setAttribute("id", "postComments");
   var currentComment, commentItem, commentImage, commentLink, p;
   for(var i = 0; i < data["comments"]["data"].length; i++){
      currentComment = data["comments"]["data"][i];
      commentItem = document.createElement("li");

      commentImage = document.createElement("img");
      commentImage.setAttribute("src", FBProfileImage(currentComment["from"]["id"]));
      commentItem.appendChild(commentImage);

      commentLink = document.createElement("a");
      commentLink.setAttribute("href", FBProfileLink(currentComment["from"]["id"]));
      commentLink.innerHTML = currentComment["from"]["name"];
      commentItem.appendChild(commentLink);

      p = document.createElement("p");
      p.innerHTML = currentComment["message"];
      commentItem.appendChild(p);

      postComments.appendChild(commentItem);
   }

   var commentForm = document.createElement("form");
   var commentBox = document.createElement("input");
   commentBox.setAttribute("type", "text");
   commentBox.setAttribute("placeholder", "Add a comment...");
   commentBox.className = "add-comment";
   commentForm.appendChild(commentBox);

   postComments.appendChild(commentForm);
   return postComments;
}

var parsePostLikes = function(data) {
   var postLikes = document.createElement("div");
   postLikes.setAttribute("id", "likes");
   postLikes.innerHTML = "<span class='likes-count'>" + data["likes"].count + "</span> ";
   if( data["likes"].count == 1 )
      postLikes.innerHTML += "person likes";
   else
      postLikes.innerHTML += "people like";
   postLikes.innerHTML += " this.";
   return postLikes;
}

function feedTime(date) {
  var hours = date.getHours();

  var clock = "AM";
  if(hours >= 12 && hours != 24)
    clock = "PM";

  if(hours > 12) 
    hours -= 12;

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

page = "/me/home";

var morePostsButton = function(){
	var button = document.createElement("a");
	button.innerHTML = "More";
	button.setAttribute("id", "more-posts");
	button.setAttribute("href", "#");
	button.onclick = function(e){
		initFeed();
//		this.style.display = 'none';
		e.preventDefault();
	};
	return button;
}

var initFeed = function(){
	FB.api(page, function(feed){
	for( var i = 0; i < feed['data'].length; i++){
		var feedItem = feed['data'][i];
		console.log(feedItem);
		document.getElementById("feed").appendChild(parseFeedItem(feedItem));
	}
	document.getElementById("feed").appendChild(morePostsButton());
	page = "/me/home?limit=25&" + feed["paging"]["next"].match(/until=[0-9]*/);
	});
	document.getElementById("more-posts").style.display = "none";
}

var init = function(){
	initFeed();
};

var checkWindowPosition = function(){
   if( window.innerHeight + document.body.scrollTop >=
		document.body.offsetHeight  && document.body.offsetHeight > 100){
      initFeed();
   }
}

//var t = setInterval("checkWindowPosition()", 2000);
