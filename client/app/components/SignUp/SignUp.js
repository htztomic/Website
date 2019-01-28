import React, {Component} from 'react';
import CssModules from 'react-css-modules'
import styles from '../../styles/homeStyle.scss';
import {getFromStorage, setInStorage} from '../../utils/storage';


class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
    	signUpEmail:'',
    	signUpPass:'',
    	signUpPassTwo:'',
    	signUpError:'',
    	token:''
    };
    this.onTextBoxChangeSignUpEmail = this.onTextBoxChangeSignUpEmail.bind(this);
    this.onTextBoxChangeSignUpPass = this.onTextBoxChangeSignUpPass.bind(this);
    this.onTextBoxChangeSignUpPassTwo = this.onTextBoxChangeSignUpPassTwo.bind(this);
    this.onClickForSignUp = this.onClickForSignUp.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage("chaos_website");
    if(obj && obj.token){
      const token = obj.token;
      fetch('/api/verify?token='+ token)
      .then(res => res.json())
      .then(json => {
        if(json.success){
          this.setState({
            isLoading:false,
            token:token
          });
        }
        else{
          this.setState({
            isLoading:false
          });
        }
      });
    }
    else{
      this.setState({
        isLoading:false
      });
    }
  }


  onClickForSignUp(){
  	this.setState({
  		isLoading:true
  	});
  	const{signUpPassTwo, signUpPass, signUpEmail} = this.state; 
  	fetch('/api/signup', {method: 'POST',  headers: {
    	'Accept': 'application/json',
    	'Content-Type': 'application/json',
 	 	}, body:JSON.stringify({
  	 		email:signUpEmail,
  	 	password:signUpPass,
  	 	password2:signUpPassTwo 
  	 	})
  		}).then(res => res.json())
      	.then(json => {
        	if(json.success){
        		window.location.href='/';
        	}
        	else{
        		this.setState({
        		signUpError: json.message,
        		signUpEmail:'',
        		signUpPass:'',
        		signUpPassTwo: '',
        		isLoading: false
        		});
        	}

      	});
  }

  onTextBoxChangeSignUpEmail(event){
  	this.setState({
  		signUpEmail: event.target.value
  	});
  }
  onTextBoxChangeSignUpPass(event){
  	this.setState({
  		signUpPass: event.target.value
  	});
  }
   onTextBoxChangeSignUpPassTwo(event){
  	this.setState({
  		signUpPassTwo: event.target.value
  	});
  }

  render() {
    const {isLoading,token, signUpEmail, signUpPass, signUpPassTwo,signUpError} =this.state;
    if(isLoading){
      return(<div><p>Loading...</p></div>);
    }
    if(!token){
      return (
      <div class="login-page">
      <div class="form">
      <form class="register-form">
       {
  		(signUpError) ? (
  			<p class ='error'>{signUpError}</p>
  			):(null)
  		}
      <input type="text" placeholder="email address" value = {signUpEmail} 
    onChange= {this.onTextBoxChangeSignUpEmail} />
      <input type="password" placeholder="password" value={signUpPass} 
	onChange = {this.onTextBoxChangeSignUpPass} />
      <input type="password" placeholder="repeat password" value={signUpPassTwo}
  	onChange = { this.onTextBoxChangeSignUpPassTwo}/>
      <button onClick = {this.onClickForSignUp}>create</button>
      <p class="message">Already registered? <a href="/">Sign In</a></p>
      </form>
       </div>
       </div>
        );
    }
	window.location.href = "/";
  }
}




export default CssModules(SignUp, styles);

