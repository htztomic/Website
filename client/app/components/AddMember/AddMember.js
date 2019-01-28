import React,{Component} from 'react';
import CssModules from 'react-css-modules'
import styles from '../../styles/approvalForm.scss';
import {getFromStorage, setInStorage} from '../../utils/storage';
class AddMember extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      firstName:'',
      lastName:'',
      errorMessage : '',
      email :'',
      id:'',
      phoneNumber:''
    };
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeId = this.onChangeId.bind(this);
    this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage("chaos_website");
    if (obj && obj.token) {
      const token = obj.token;
      fetch('/api/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
              this.setState({
                loggedIn: true,
              });

          } else {
            window.location.href = '/'
          }
        });
    } else {
      window.location.href = '/'
    }
  }
  onChangeEmail(event){
    this.setState({
      email:event.target.value
    })
  }

  onChangeFirstName(event){
    this.setState({
      firstName:event.target.value
    });
  }
  onChangeLastName(event){
    this.setState({
      lastName:event.target.value
    });
  }
  onChangePhoneNumber(event){
    this.setState({
      phoneNumber:event.target.value
    });
  }
  onChangeId(event){
    this.setState({
      id:event.target.value
    });
  }

  onClickSubmit(){
    const{firstName,lastName,email,id,phoneNumber} = this.state;
    fetch('/api/addmember', {method: 'POST',  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }, body:JSON.stringify({
        email:email,
        firstName:firstName,
        lastName:lastName,
        id:id,
        phoneNumber:phoneNumber 
      })
      }).then(res => res.json())
        .then(json => {
          if(json.success){
            this.setState({
              firstName :'',
              lastName:'',
              phoneNumber:'',
              id:'',
              errorMessage : json.message,
              email : ''
            })
          }
          else{
            this.setState({
              errorMessage : json.message,
            });
          }
        });
  }

  render() {
    const {loggedIn, errorMessage,email, firstName,lastName, id,phoneNumber} =this.state;
    if(loggedIn){
     return(
      <div class="form-style-5">
<form>
<fieldset>
{
  (errorMessage) ? (<p>{errorMessage}</p>) : (null)
}
<legend><span class="number">1</span> Member Info</legend>
<input type="text" value = {firstName} onChange = {this.onChangeFirstName} placeholder="First name *"/> 
<input type="text" value = {lastName} onChange = {this.onChangeLastName} placeholder="Last name *"/>
<input type="text" value = {phoneNumber} onChange = {this.onChangePhoneNumber} placeholder="Phone number *"/>
<input type="text" value = {id} onChange = {this.onChangeId} placeholder="Student ID/Government ID *"/>
<input type="email" value = {email} onChange = {this.onChangeEmail} placeholder="Email required for registering member *"/>     
</fieldset>
<input type="button" value="Submit" onClick = {this.onClickSubmit} />
</form>
</div>
  	);
	}
}
}

export default CssModules(AddMember, styles);