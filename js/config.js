// Firebase auth infomation. Do not use admin tokens!
// Get Firebase Config at https://firebase.google.com/docs/web/setup
var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

var Function_URL = ""; // replace with your cloud function URL. Should be https://us-central1-(PROJECT_ID).cloudfunctions.net

// Get Firebase messaging keys at console.firebase.google.com/project/(PROJECT_ID)/settings/cloudmessaging
var Firebase_Messaging_vapidKey = ""; // Web Push certificates > Key pair
var Firebase_Messaging_Key = ""; // Project credentials > Server key

// Algolia auth information. Do not use admin tokens!
// Get Algolia keys at algolia.com/apps/(APP_ID)/api-keys/all
const search = instantsearch({
    indexName: '', // Indices Index name
    hitsPerPage: 500,
    searchClient: algoliasearch(
        '', // Application ID
        '' // algolia.com/apps/(APP_ID)/api-keys/all > Search-Only API Key
    )
});