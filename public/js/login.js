const loginForm = document.querySelector('.login');
// login form
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        //enterIfBusiness();
        loginForm.reset();
      })
      .catch(error => {
        const errorMessage = error.message;
            window.alert('Error : ' + errorMessage);
      });
  });

 /* function enterIfBusiness() {
    firebase.auth().onAuthStateChanged(function (user){
    const ref = firebase.database().ref();
    const userM=user.uid;
    ref.child('Users').child(userM).once('value', function(snap) { // once - only for one time connected
      snap.forEach(function(item) {
        const itemVal = item.val();
        console.log(itemVal);
        if (itemVal.Account==1) {//  business=1
          location.href = 'businessPage.html';
        }
      });
    });
  });
  }
  $(document).ready(function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("user");location.href = 'index.html';
    }
    else{
      
    }
  });
});*/