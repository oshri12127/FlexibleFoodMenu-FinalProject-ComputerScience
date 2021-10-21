
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
  })
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
      if (!(document.URL.includes("login") || document.URL.includes("signup") || !document.URL.includes("/"))) {
        location.href = 'login';
      }
    }
  })
  if(!document.URL.includes("/"))
  {
    carousel();
  }
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
        if ((document.URL.includes("login")) || (document.URL.includes("signup"))) {
          location.href = 'businessPage';
        }
      }
      else {
        document.getElementById('business').style.visibility = 'hidden';
        if ((document.URL.includes("login")) || (document.URL.includes("signup")) || (document.URL.includes("businessPage"))) {
          location.href = '';
        }
      }
    });
  });
}

function carousel() {
  var index = 1;
  var datesRef = firebase.database().ref();
  datesRef.child('Restaurants').once('value', function (snap) { //once - only for one time connected
    snap.forEach(function (item) {
      var itemVal = item.val();
      const city = itemVal.RestInfo.Location.address.split(",");
      if (city[1].includes("תל אביב")) {
        document.getElementById('img-' + index).src = itemVal.RestInfo.picUrl;
        document.getElementById('h4-' + index).innerHTML = itemVal.RestInfo.Name;
        document.getElementById('span-' + index).innerText = itemVal.RestInfo.Description;
        index++;
        if(index == 7)
          return;
      }
    });
  });
}
