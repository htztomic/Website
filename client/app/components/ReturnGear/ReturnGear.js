import React,{Component} from 'react';
import CssModules from 'react-css-modules'
import styles from '../../styles/approvalForm.scss';
import {getFromStorage, setInStorage} from '../../utils/storage';
class ReturnGear extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      search:true,
      email:'',
      errorMessage:'',
      listGear:'',
      info:'',
      comment:'',
      returnInfo:{}
    };
    this.onClickSearch = this.onClickSearch.bind(this);
    // this.onSelectGear = this.onSelectGear.bind(this);
    // this.onChangePrice = this.onChangePrice.bind(this);
    // this.onSelectType = this.onSelectType.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeCondition = this.onChangeCondition.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
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
            loggedIn:true,
          });
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
    });
  }
  onClickSearch(){
    const{email} = this.state;
    fetch('/api/attaininfo?email='+ email)
      .then(res => res.json())
      .then(json => {
        if(json.success){
          const gears = json.info.gears;
          var i;
          var returnInfo= {};
          for(i = 0; i <gears.length; i++){
            returnInfo[gears[i].gearId] = '';
          }
          const listGear = gears.map((gears) =>
            <div>
            <label >Gear name: {gears.gearName}</label>
            <label >Gear type: {gears.gearType}</label>
            <label >Gear condition:</label>
            <select onChange={this.onChangeCondition} id= {gears.gearId} >
            <option value=""></option>
            <option value="normal">Normal</option>
            <option value="damage">Damaged</option>
            <option value="lost">Lost</option>
            </select> 
            </div>
            );
          this.setState({
            listGear:listGear,
            info:json.info,
            search:false,
            returnInfo:returnInfo,
            errorMessage:''
          });
        }
        else{
          this.setState({
            errorMessage: json.message
          });
        }
      });
  }
  onChangeComment(event){
    this.setState({
      comment:event.target.value
    });
  }

  onChangeCondition(event){
    const{returnInfo} = this.state;
    returnInfo[event.target.id] = event.target.value;
    this.setState({
      returnInfo:returnInfo
    });
  }


  onClickSubmit() {
    const {
      comment,
      returnInfo,
      info
    } = this.state;
    fetch('/api/returngear', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: comment,
          gearInfo: returnInfo,
          checkoutId: info._id,
          firstName:info.firstName,
          lastName:info.lastName,
          gears:info.gears
        })
      }).then(res => res.json())
      .then(json => {
        if (json.success) {
          console.log(json);
          this.setState({
            search: true,
            email:'',
            errorMessage: json.message
          });
        } else {
          this.setState({
            errorMessage: json.message,
          });
        }
      });
  }
  render() {
    const {loggedIn, errorMessage,email, search,listGear, info,comment} =this.state;
    if(loggedIn && search){
     return(
      <div class="form-style-5">
<form>
<fieldset>
{
  (errorMessage) ? (<p>{errorMessage}</p>) : (null)
}
<legend><span class="number">1</span> Search User</legend>
<input type="email" value = {email} onChange = {this.onChangeEmail} placeholder="Email used for checkout *"/>
</fieldset>
<input type="button" value="Search" onClick = {this.onClickSearch} />
</form>
</div>
    );
  }
  if(loggedIn){
  return(<div class="form-style-5">
    <form>
    <fieldset>
    {
      (errorMessage) ? (<p>{errorMessage}</p>) : (null)
    }
    <legend><span class="number">1</span> {info.firstName} {info.lastName}'s gears</legend>
    {listGear}
    <textarea onChange={this.onChangeComment} value= {comment} placeholder="Comment section"/>
    </fieldset>
    <input type="button" onClick={this.onClickSubmit} value="Return"/>

    </form>
    </div>);
  }
}
}

export default CssModules(ReturnGear, styles);