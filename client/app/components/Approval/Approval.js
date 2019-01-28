import React,{Component} from 'react';
import CssModules from 'react-css-modules'
import styles from '../../styles/approvalForm.scss';
import {getFromStorage, setInStorage} from '../../utils/storage';
class Approval extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      isAdmin: false,
      approvalStatus:'',
      errorMessage : '',
      email :''
    };
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.onSelectChangeNewValue = this.onSelectChangeNewValue.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage("chaos_website");
    if(obj && obj.token){
      const token = obj.token;
      fetch('/api/verify?token='+ token)
      .then(res => res.json())
      .then(json => {
        if(json.success){
          if (!json.isAdmin) {
              window.location.href = '/';
            } else {
              this.setState({
                loggedIn: true,
                isAdmin: json.isAdmin
              });
            }
        }
        else{
          window.location.href = '/'
        }
      });
    }
    else{
      window.location.href = '/'
    }
  }
  onChangeEmail(event){
    this.setState({
      email:event.target.value
    })
  }

  onSelectChangeNewValue(event){
    this.setState({
      approvalStatus:event.target.value
    });
  }

  onClickSubmit(){
    const{approvalStatus,email} = this.state;
    var isAdmin = false;
    var isApproved = false;
    if(!approvalStatus){
      this.setState({
        errorMessage:'Type of approval was not selected'
      })
    }
    else{
      if(approvalStatus == 'regular'){
        isApproved = true;
      }
      else if(approvalStatus == "admin"){
        isAdmin = true;
        isApproved = true;
      }
          fetch('/api/approval', {method: 'POST',  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }, body:JSON.stringify({
        email:email,
        isAdmin:isAdmin,
        isApproved:isApproved 
      })
      }).then(res => res.json())
        .then(json => {
          if(json.success){
            this.setState({
              approvalStatus :'',
              errorMessage : json.message,
              email : '',
            })
          }
          else{
            this.setState({
              approvalStatus :'',
              errorMessage : json.message,
              email : '',
            });
          }
        });
      }
  }

  render() {
    const {loggedIn,isAdmin, errorMessage,email,approvalStatus} =this.state;
    if(loggedIn && isAdmin){
     return(
      <div class="form-style-5">
<form>
<fieldset>
{
  (errorMessage) ? (<p>{errorMessage}</p>) : (null)
}
<legend><span class="number">1</span> Approval Info</legend>
<input type="email" value = {email} onChange = {this.onChangeEmail} placeholder="Email required for approval *"/>   
<label >Type of Approval:</label>
<select value={approvalStatus} onChange ={this.onSelectChangeNewValue} >
  <option value=""></option>
  <option value="regular">Regular Approval</option>
  <option value="admin">Admin Approval</option>
</select> 
</fieldset>
<input type="button" value="Submit" onClick = {this.onClickSubmit} />
</form>
</div>
  	);
	}
}
}

export default CssModules(Approval, styles);