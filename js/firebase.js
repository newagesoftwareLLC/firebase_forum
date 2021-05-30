//config.js required
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();
const messaging = firebase.messaging();

var topicID;
var prevIDs = [];

function SendMessage(type, obj_id, user_id, content, title, category) {
    messaging.getToken({vapidKey: Firebase_Messaging_vapidKey})
    .then((currentToken) => {
        if (currentToken) {
            var notification = {
                'title': title,
                'type': type,
                'content': content,
                'obj_id': obj_id,
                'user_id': user_id,
                'category': category
              };
              
              fetch('https://fcm.googleapis.com/fcm/send', {
                'method': 'POST',
                'headers': {
                  'Authorization': 'key=' + Firebase_Messaging_Key,
                  'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                  'notification': notification,
                  'to': currentToken
                })
              }).then(function(response) {
                console.log(response);
              }).catch(function(error) {
                console.error(error);
              })
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
}

function SubmitNewPost() {
    AuthCheck();
    $.ajax({
        url: NewPost_Function_URL,
        type: 'post',
        data: {
            category: document.getElementById("category").value, 
            content: simplemde_post.value(),
            title: document.getElementById("title").value, 
            accid: uid,
            type: "newtopic"
        },
        dataType: 'application/json',
        complete: function(xhr) {
            if (xhr.status == 200) {
                console.log("[SUCCESS] New Thread Created.");
                SendMessage("post", JSON.parse(xhr.responseText).id, uid, simplemde_post.value().value, document.getElementById("title").value, document.getElementById("category").value);
                document.getElementById("title").value = "";
                simplemde_post.value("");
                $.fancybox.close();
            }
            else
                alert("[FAILED] New Thread Creation Failed!");
        }
    });
}

function AuthCheck() {
    if (uid == null || uid == "") {
        alert("Login required! Click the link in the upper right corner.");
        return false;
    }
    return true;
}

function SubmitNewReply() {
    if (!AuthCheck()) return;
    if (topicID == null || topicID == ""){
        alert("topic ID required!");
        return;
    }
    $.ajax({
        url: NewReply_Function_URL,
        type: 'post',
        data: {
            parent: topicID,
            content: simplemde_reply.value(),
            accid: uid,
            type: "reply"
        },
        dataType: 'application/json',
        complete: function(xhr) {
            if (xhr.status == 200) {
                console.log("[SUCCESS] New Reply Created.");
                SendMessage("reply", JSON.parse(xhr.responseText).id, uid, simplemde_reply.value(), "Reply to topic " + topicID, "");
                simplemde_reply.value("");
                $.fancybox.close();
            }
            else
                alert("[FAILED] New Reply Creation Failed!");
        }
    });
}

messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    if (payload.data["gcm.notification.type"] == "post") {
        $('#hits').prepend(`<div id="` + payload.data["gcm.notification.obj_id"] + `"><a href="javascript:;" onclick="GetTopic('` + payload.data["gcm.notification.obj_id"] + `')">` + payload.notification.title + ` <span class="badge">` + payload.data["gcm.notification.category"] + `</span><span class="badge badge-warning">NEW!</span></a></div>`);
    } else if (payload.data["gcm.notification.type"] == "reply") {
        FetchUsers().then(function(fetch) {
            $('#post_replies').prepend("<h4>Reply By: " + fetch[payload.data["gcm.notification.user_id"]].displayName + "</h4><p>" + payload.data["gcm.notification.content"] + "</p>");
        });
    } else {
        console.error("onMessage received payload with unknown type: " + payload.data["gcm.notification.type"]);
    }
});

async function FetchUsers() { // displayName, photoURL
    var Today = new Date().getTime();
    var OneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000);
    if (localStorage.getItem("expire") === null) {
        console.log("Setting localStorage for 24 hours expiration. Retrieving new users list.");
        localStorage.setItem("expire", Today);
    }
    if (OneDay < Today) {
        console.log("Expiring localStorage. It's been 24 hours. Retrieving new users list.");
        localStorage.clear();
    }

    if (localStorage.getItem("FetchedUsers") === null) {
        return $.getJSON(UserListURL_Function_URL).then(function(data){
            localStorage.setItem( "FetchedUsers", JSON.stringify(data) );
            return JSON.parse( localStorage.getItem('FetchedUsers') );
        })
        .done(function() { console.log("FetchUsers finished"); })
        .fail(function(jqXHR, textStatus, errorThrown) { alert('FetchUsers request failed! ' + textStatus); });
    } else {
        //console.log("pulling FetchUsers from localStorage");
        return JSON.parse( localStorage.getItem('FetchedUsers') );
    }
}

function GetTopic(firebaseID) {
    ArrowAtThread(firebaseID);
    $( ".post_info" ).css("visibility", "visible");
    topicID = firebaseID;
    db.collection('topics').doc(firebaseID)
    .get()
    .then((doc) => {
        FetchUsers().then(function(fetch) {
            document.getElementById("post_content").innerHTML = "<h2>" + doc.data().title + "</h2><i>Post By: " + fetch[doc.data().user_id.toString()].displayName + "</i><p>" + doc.data().content + "</p>";
            document.getElementById("post_replies").innerHTML = ""; // erase replies of previous topic
            db.collection('replies').where("parent", "==", doc.id).orderBy("created", "desc")
            .get()
            .then((snapshot) => {
                snapshot.docs.forEach((doc2) => {
                    document.getElementById("post_replies").innerHTML += "<h4>Reply By: " + fetch[doc2.data().user_id].displayName + "</h4><p>" + doc2.data().content + "</p>";
                });
            });
        });
    });
}

