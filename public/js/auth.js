
const firebaseConfig = {
  apiKey: "AIzaSyB7CjUg_Xg6om7TecpweGDZQ4oIEq2LmMg",
  authDomain: "flexiblefoodmenu-finalproject.firebaseapp.com",
  databaseURL: "https://flexiblefoodmenu-finalproject-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "flexiblefoodmenu-finalproject",
  storageBucket: "flexiblefoodmenu-finalproject.appspot.com",
  messagingSenderId: "437058897811",
  appId: "1:437058897811:web:9f4890f75fae7c3f658a66"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const signOut = document.querySelector('.sign-out');

// sign out
signOut.addEventListener('click', () => {
  w3ls.reset();
  firebase.auth().signOut()
    .then(() => console.log('signed out'));
});
// auth listener
$(document).ready(function () {
  $(window).on('load', function () {
    $(".loader").fadeOut();
    $("#preloder").delay(200).fadeOut("slow");
  });
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      $('#login').hide();
      $('#signup').hide();
      $('#signout').show();
      $('#emailUserHello').show();
      isBusinessAccount(user);
    }
    else {
      $('#login').show();
      $('#signup').show();
      $('#signout').hide();
      $('#emailUserHello').hide();
      document.getElementById('business').style.visibility = 'hidden';
      w3ls.reset();
      firebase.auth().signOut();
      $("#sunmitSearch").click(function () {
        alert("To Search Please Login.");
      });
      if (!(document.URL.includes("login.html") || document.URL.includes("signup.html") || document.URL.includes("index.html"))) {
        location.href = 'login.html';
      }
    }
  })
});

function isBusinessAccount(user) {
  const emailUserHello = document.getElementById('emailUserHello');
  const ref = firebase.database().ref();
  const userM = user.uid;
  ref.child('Users').child(userM).once('value', function (snap) { // once - only for one time connected
    snap.forEach(function (item) {
      const itemVal = item.val();
      emailUserHello.innerHTML = 'Hello ' + itemVal.Name;
      if (itemVal.Account == 1) {//  business=1
        document.getElementById('business').style.visibility = 'visible';
        if ((document.URL.includes("login.html")) || (document.URL.includes("signup.html"))) {
          location.href = 'businessPage.html';
        }
      }
      else {
        document.getElementById('business').style.visibility = 'hidden';
        if ((document.URL.includes("login.html")) || (document.URL.includes("signup.html")) || (document.URL.includes("businessPage.html"))) {
          location.href = 'index.html';
        }
      }
    });
  });
}