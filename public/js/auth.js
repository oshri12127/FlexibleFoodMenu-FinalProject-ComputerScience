
const signOut = document.querySelector('.sign-out');

// sign out
signOut.addEventListener('click', () => {
    firebase.auth().signOut()
      .then(() => console.log('signed out'));
  });
// auth listener
$(document).ready(function() {
  firebase.auth().onAuthStateChanged(user => 
  {
    if (user) 
    {
      $('#login').hide();
      $('#signup').hide();
      $('#signout').show();
      isBusinessAccount(user); 
    } 
    else
    {
      $('#login').show();
      $('#signup').show();
      $('#signout').hide();
      document.getElementById('business').style.visibility = 'hidden';
      firebase.auth().signOut();
      if (!(document.URL.includes("login.html")||document.URL.includes("signup.html")||document.URL.includes("index.html"))) {
        location.href = 'index.html';
      }
    }
  })
});

function isBusinessAccount(user) {
  const ref = firebase.database().ref();
        const userM=user.uid;
        ref.child('Users').child(userM).once('value', function(snap) { // once - only for one time connected
          snap.forEach(function(item) 
          {
            const itemVal = item.val();
            if (itemVal.Account==1) {//  business=1
              if(document.URL.includes("index.html"))
              {
                document.getElementById('business').style.visibility = 'visible';
              }
              else if((document.URL.includes("login.html"))||(document.URL.includes("signup.html")))
              {
                location.href = 'businessPage.html';
              }
            }
            else
            {
              if(document.URL.includes("index.html"))
              {
                document.getElementById('business').style.visibility = 'hidden';
              }
              else
              {
                location.href = 'index.html';
              }
            }
          });
        });
}