import React,{Component} from 'react';
import CssModules from 'react-css-modules'
import styles from '../../styles/approvalForm.scss';
import {getFromStorage, setInStorage} from '../../utils/storage';
class EditReturn extends Component {
  constructor(props) {
    super(props);


    this.state = {
      loggedIn: false,
      isAdmin: false,
      token:'',
      search:true,
      errorMessage : '',
      chosen:'',
      options:null,
      email :'',
      listGear:'',
      userInfo:'',
      gearInfo:'',
      comment:'',
      firstName:'',
      lastName:'',
      results:''
    };
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.onSelectChangeNewValue = this.onSelectChangeNewValue.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onChangeCondition = this.onChangeCondition.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onClickClear = this.onClickClear.bind(this);
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
              fetch('/api/returnforms?token=' + token)
              .then(res => res.json())
              .then(json => {
                if (json.success) {
                  const results = json.results;
                  let options = json.results.map((results) =>
                    <option value = {results.checkoutId} > {results.firstName} {results.lastName} < /option>
                  );
                  var userInfo ={};
                  var gearInfo = {};
                  var i;
                  for(i=0; i<results.length; i++){
                    userInfo[results[i].checkoutId] = results[i];
                    gearInfo[results[i].checkoutId] = results[i].gearInfo;
                  }
                  this.setState({
                    options:options,
                    results:json.results,
                    loggedIn:true,
                    token:token,
                    isAdmin:true,
                    userInfo:userInfo,
                    gearInfo:gearInfo
                  });
                } else {
                  this.setState({
                    token:token,
                    loggedIn:true,
                    isAdmin:true
                  })
                }
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
      chosen:event.target.value
    });
  }

  onChangeCondition(event){
    const{chosen} = this.state;
    let{gearInfo} = this.state;
    const selectedIndex = {'':0,'normal':1,'damage':2,'lost':3}
    document.getElementById(event.target.id).selectedIndex = selectedIndex[event.target.value];
    gearInfo[chosen][event.target.id] = event.target.value;
    this.setState({
      gearInfo:gearInfo
    });
  }
  onChangeComment(event){
    this.setState({
      comment:event.target.value
    });
  }
  onClickSave(){
    const{chosen, gearInfo, comment,userInfo,firstName,lastName} = this.state;
    fetch('/api/returngear', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: comment,
          gearInfo: gearInfo[chosen],
          checkoutId: chosen,
          firstName:firstName,
          lastName:lastName,
          gears:userInfo[chosen].gears
        })
      }).then(res => res.json())
      .then(json => {
        if (json.success) {
          console.log(json);
          this.setState({
            search: true,
            errorMessage: json.message
          });
        } else {
          this.setState({
            errorMessage: json.message,
          });
        }
      });
  }


  onClickClear(){
    const{chosen, gearInfo,comment}= this.state;
    fetch('/api/clearreturngear', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gearInfo: gearInfo[chosen],
          comment:comment,
          checkoutId: chosen
        })
      }).then(res => res.json())
      .then(json => {
        if (json.success) {
          console.log(json);
          this.setState({
            search: true,
            errorMessage: json.message
          });
        } else {
          this.setState({
            errorMessage: json.message,
          });
        }
      });
  }

  onClickSubmit() {
    const{chosen,gearInfo,userInfo}= this.state;
    const firstName = userInfo[chosen].firstName;
    const lastName = userInfo[chosen].lastName;
    const comment = userInfo[chosen].comment;
    var selection = {};
    var i;
    var gears = userInfo[chosen].gears;
    for(i=0; i<gears.length;i++){
      var template = {};
      template[gearInfo[chosen][gears[i].gearId]] = 'selected';
      selection[gears[i].gearId] = template;
    }
    console.log(selection);

    const listGear = gears.map((gears) =>
            <div>
            <label >Gear name: {gears.gearName}</label>
            <label >Gear type: {gears.gearType}</label>
            <label >Gear condition:</label>
            <select onChange={this.onChangeCondition} id= {gears.gearId} >
            <option value=""></option>
            <option value="normal" selected={selection[gears.gearId]['normal']}>Normal</option>
            <option value="damage" selected={selection[gears.gearId]['damage']}>Damaged</option>
            <option value="lost" selected={selection[gears.gearId]['lost']}>Lost</option>
            </select> 
            </div>
            );
    this.setState({
      search:false,
      listGear:listGear,
      firstName:firstName,
      lastName:lastName,
      comment:comment
    });
  }

  render() {
    const {loggedIn,isAdmin, errorMessage,options, chosen,search, listGear,firstName,lastName,comment} =this.state;
    if(loggedIn && isAdmin && search){
     return(
      <div class="form-style-5">
<form>
<fieldset>
{
  (errorMessage) ? (<p>{errorMessage}</p>) : (null)
}
<legend><span class="number">1</span> All return forms with comments</legend>   
<label >Select return form:</label>
<select value={chosen} onChange ={this.onSelectChangeNewValue} >
  <option value=""></option>
  {options}
</select> 
</fieldset>
<input type="button" value="Edit" onClick = {this.onClickSubmit} />
</form>
</div>
  	);
	}
  if(loggedIn && isAdmin){
    return(<div class="form-style-5">
    <form>
    <fieldset>
    {
      (errorMessage) ? (<p>{errorMessage}</p>) : (null)
    }
    <legend><span class="number">1</span> {firstName} {lastName}'s gears</legend>
    {listGear}
    <textarea onChange={this.onChangeComment} value= {comment} placeholder="Comment section"/>
    </fieldset>
    <button  class="add" onClick={this.onClickSave} >Save</button>
    <button  class="remove" onClick={this.onClickClear}>Clear</button>
    </form>
    </div>);
  }
}
}

export default CssModules(EditReturn, styles);