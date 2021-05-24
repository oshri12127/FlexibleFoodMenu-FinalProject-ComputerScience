const registerForm = document.querySelector('.register');
///register Form
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    const Confirm_Password = registerForm.Confirm_Password.value;
    business=0;
    if(registerForm.business.checked)
      {business = 1;} 
    const Username = registerForm.Username.value;
    if(Confirm_Password==password){
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(user => {
        initUser(Username,business);
        //demo(business);
        demo();
      })
      .catch(error => {
        const errorMessage = error.message;
            window.alert('Error : ' + errorMessage);
      });
    }
    else
    {
      window.alert('Error: Passwords do not match');
    }
  })

var userNow2;
function initUser(Username,business){ 
firebase.auth().onAuthStateChanged(function (user){
userNow2 = user.uid;
user.updateProfile({
  displayName: Username,
});
var datesRef = firebase.database().ref();
datesRef.child('Users').child(userNow2).child('info').set({
  Account: business,
  Name: Username,
  UserId: userNow2,
});
});
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function demo()//(business) 
{
  await sleep(3000);
  registerForm.reset();
  /*if(business==1)
    {
      location.href = 'businessPage.html';
    }
  else
  {
    registerForm.reset();
  }*/
  
}