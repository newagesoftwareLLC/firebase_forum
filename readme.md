## About
Forum system for static web pages.

- DB hosted in Firestore.
- Messaging by Firebase.
- Programmed completely in JavaScript.
- Search functionality provided by Algolia.

## Setup
1) Create a [Firebase.com](https://firebase.google.com) account. Create a project.
2) Create an [Algolia.com](https://www.algolia.com) account. Create an Indices Index that reflects the project name in Firebase.
3) Open `js/config.js` in a text editor, like NotePad, etc.
- Firebase Cloud Messaging Key -> console.firebase.google.com/project/(PROJECT_ID)/settings/cloudmessaging
- [Firebase configuration info](https://firebase.google.com/docs/web/setup) (Scroll half way down)
- Algolia API Keys -> algolia.com/apps/(APP_ID)/api-keys/all
4) On firebase.com, create a Firestore data collection. Edit the rules to:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null;
    }
  }
}
```
5) In the Firestore Database section, click Indexes. You need to create an index for `created Descending`. If it's not created, you'll get a warning in the browser console with a link to create it later.
6) In Algolia under the `Indices > Configuration > Ranking and Sorting` click `Add custom ranking attribute` and add `created Descending`.
7) Follow the rest of the steps in [this Gist file](https://gist.github.com/erfg12/f5a6ef802f2883ae9327ae7d2fdaaee0) to setup the Firebase functions.
