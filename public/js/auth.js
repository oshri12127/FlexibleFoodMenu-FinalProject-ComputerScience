
const signOut = document.querySelector('.sign-out');

// sign out
signOut.addEventListener('click', () => {
    firebase.auth().signOut()
      .then(() => console.log('signed out'));
  });
// auth listener
$(document).ready(function() {
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        $('#login').hide();
        $('#signup').hide();
        $('#signout').show();
        if (! document.URL.includes("index.html") ) {
            location.href = 'index.html';}
    } else {
        $('#login').show();
        $('#signup').show();
        $('#signout').hide();
        firebase.auth().signOut();
    }
  });
});