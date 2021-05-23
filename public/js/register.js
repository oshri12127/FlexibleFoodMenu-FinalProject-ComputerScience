const registerForm = document.querySelector('.register');
///register Form
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = registerForm.email.value;
    const password = registerForm.password.value;
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(user => {
       // location.href = 'index.html';
        registerForm.reset();
      })
      .catch(error => {
        const errorMessage = error.message;
            window.alert('Error : ' + errorMessage);
      });
  })