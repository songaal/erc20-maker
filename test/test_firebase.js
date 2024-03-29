

// Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "apiKey",
    authDomain: "tokens-e80a0.firebaseapp.com",
    databaseURL: "https://erc20-tokens.firebaseio.com/",
    storageBucket: "bucket.appspot.com"
  };

  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();

  function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('erc20/').set({
      username: name,
      email: email,
      profile_picture : imageUrl
    });
  }
firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
  // ...
});