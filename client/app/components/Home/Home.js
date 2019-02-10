import React, { Component } from 'react';
import 'whatwg-fetch';
import {getFromStorage, setInStorage} from '../../utils/storage';
import styles from '../../styles/homeStyle.scss';
import CssModules from 'react-css-modules';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signInError: '',
      signInEmail: '',
      listItem:'',
      signInPass: '',
      counter:[]
    };
    this.onTextBoxChangeSignUpEmail = this.onTextBoxChangeSignUpEmail.bind(this);
    this.onTextBoxChangeSignUpPass = this.onTextBoxChangeSignUpPass.bind(this);
    this.onClickSignIn = this.onClickSignIn.bind(this);

  }
  componentDidMount() {
    const obj = getFromStorage("chaos_website");
    if (obj && obj.token) {
      const token = obj.token;
      fetch('/api/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            const gearData = require('../../GearData/GearData.json');
            var keys = ["sleepingbag","tent","backpack","campingstove"];
            fetch('/api/gearcount', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  gears: keys,
                })
              }).then(res => res.json())
              .then(json => {
                if (json.success) {
                  const listItem = json.itemList.map((counter) =>
                    <
                    div class = "column" >
                    <
                    div class = "card" >
                    <
                    p > < i class = "fa" > < /i></p >
                    <
                    h3 > {
                      counter.count
                    } < /h3> <
                    p > {
                      counter.name
                    } < /p> <
                    /div> <
                    /div>
                  );
                  this.setState({
                    listItem: listItem
                  });
                }
              });
            this.setState({
              isLoading: false,
              token: token
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  onClickSignIn() {
    this.setState({
      isLoading: true
    });
    const {
      signInPass,
      signInEmail
    } = this.state;
    fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signInEmail,
          password: signInPass,
        })
      }).then(res => res.json())
      .then(json => {
        if (json.success) {
          setInStorage('chaos_website', {
            token: json.token
          });
          window.location.href = '/';
        } else {
          this.setState({
            signInError: json.message,
            signInEmail: '',
            signInPass: '',
            isLoading: false
          });
        }

      });
  }


  onTextBoxChangeSignUpEmail(event) {
    this.setState({
      signInEmail: event.target.value
    });
  }
  onTextBoxChangeSignUpPass(event) {
    this.setState({
      signInPass: event.target.value
    });
  }
  onSelectChangeNewValue(event){
    console.log(event.target.value);
  }

  render() {
    const {isLoading,token,signInError,signInEmail,signInPass,expand,listItem} =this.state;
    if(isLoading){
      return(<div class="login-page"><p>Loading...</p></div>);
    }
    if(!token){
      return (
      <div class="login-page">
      <div class="form">
      <form class="login-form">
      {
        (signInError) ? (<p class = 'error'>{signInError}</p>) : (null)
      }
      <input type="text" placeholder="email" value = {signInEmail} 
      onChange = {this.onTextBoxChangeSignUpEmail}/>
      <input type="password" placeholder="password" 
      value= {signInPass}
      onChange = {this.onTextBoxChangeSignUpPass}
      />
      <button onClick={this.onClickSignIn}>login</button>
      <p class="message">Not registered? <a href="/SignUp">Create an account</a></p>
      </form>
      </div>
      </div>
      );
    }
    return (<div class="row">
    {listItem}
  </div>);
}
}
export default CssModules(Home,styles);
