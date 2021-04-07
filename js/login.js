//config.js required
var name, email, photoUrl, uid, emailVerified;

function Login() {
    var provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('repo');
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have signed up with a different provider for that email.');
        } else {
            console.error(error);
        }
    });
}

function LogOut() {
    firebase.auth().signOut().then(() => {
        alert("You are now signed out.");
    }).catch((error) => {
        alert("ERROR: There was an issue signing you out.");
    });
}

$( document ).ready(function() {
    // GitHub authentication
    firebase.auth().onAuthStateChanged(user => {
        if (user != null) {
            userName = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use this value to authenticate with your backend server, if you have one. Use User.getToken() instead.
            document.getElementById("login_info").innerHTML = "Welcome back " + userName + ". [<a href=\"javascript:;\" onclick=\"LogOut()\">LOG OUT</a>]";
        } else {
            document.getElementById("login_info").innerHTML = "<a href=\"javascript:;\" onclick=\"Login()\"><b>LOGIN WITH GITHUB</b></a>";
        }
    });
});