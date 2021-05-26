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