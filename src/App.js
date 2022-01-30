import './App.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import initializeAuthentication from './firebase/firebase.initialize';
import { useState } from 'react';

initializeAuthentication();
const googleProvider = new GoogleAuthProvider();

function App() {
  const auth = getAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const user = result.user;
        console.log(user)
      })
  }

  const toggleLogIn = (event) => {
    setIsLogin(event.target.checked)
  }

  const handleRegistration = (event) => {
    event.preventDefault()

    console.log(password, email)
    if (password.length < 6) {
      setError('Password must be at least 6 character');
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError('Password must be contain 2 Upper Case');
      return;
    }

    // isLogin ? processLogin(email, password) : createNewUser(email, password)
    if (isLogin) {
      processLogin(email, password);
    }
    else {
      registerNewUser(email, password)
    }
  }

  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setError('');
      })
      .catch((error) => {
        setError(error.message)
      })

  }

  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user
        console.log(user)
        setError('');
        verifyEmail();
        setUserName();
      })
      .catch((error) => {
        setError(error.message);
      })
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name})
        .then((result) => {
        console.log(result);
      })
        .catch((error) => {
        console.log(error.message);
      });
  }


  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then((result) => {
        console.log(result)
      })
  }
  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then((result) => {
        // Password reset email sent!
        // ..
        console.log(result);
      })

  }

  const handleNameChange = (event) => {
    setName(event.target.value);
  }
  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  return (
    <div className="mx-5">
      <form onSubmit={handleRegistration}>
        <h3 className='App text-primary'>Please {isLogin ? 'Log In' : 'Register'}</h3>

        {!isLogin && <div className="row mb-3">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input onBlur={handleNameChange} type="name" className="form-control" id="inputName" placeholder="Name" required />
          </div>
        </div>}

        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" required />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input onChange={toggleLogIn} className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" for="gridCheck1">
                Already Registered
              </label>
            </div>
          </div>
        </div>

        <div className="row mb-3 text-danger">{error}</div>
        <button type="submit" className="btn btn-primary">{isLogin ? 'Login' : 'Register'}</button>
        <button onClick={handleResetPassword} type="button" className="btn btn-secondary btn-sm">Reset password</button>

      </form>


      <br /><br /><br /><br />
      <div>----------------------------------------------</div>
      <br /><br /><br /><br />
      <button onClick={handleGoogleSignIn}>Sign In with Google</button>
    </div>
  );
}

export default App;
