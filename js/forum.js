//firebase.js required
var simplemde_post = new SimpleMDE({ element: document.getElementById("content") });
var simplemde_reply = new SimpleMDE({ element: document.getElementById("reply_content") });

function ArrowAtThread(firebaseID) {
    console.log(firebaseID);
    // clear '<' arrows from previously viewed threads
    prevIDs.forEach(el => {
        var history = document.getElementById(el).innerHTML;
        document.getElementById(el).innerHTML = history.substring(0, history.length - 9);
    });
    prevIDs = [];
    // add '<' arrow to currently selected
    if (document.getElementById(firebaseID).innerHTML.includes("<span class=\"badge badge-warning\">NEW!</span>"))
        document.getElementById(firebaseID).innerHTML = document.getElementById(firebaseID).innerHTML.replace("<span class=\"badge badge-warning\">NEW!</span>", "");
    document.getElementById(firebaseID).innerHTML += " <b><</b>";
    prevIDs.push(firebaseID);
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(function(registration) {
        console.log('Registered:', registration);
    })
    .catch(function(error) {
        console.log('Registration failed: ', error);
    });
}