import React,{Component} from 'react';
import CssModules from 'react-css-modules'
import styles from '../../styles/homeStyle.scss';
import {getFromStorage, setInStorage} from '../../utils/storage';

class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gearData:require('../../GearData/GearData.json'),
      gearInfo: require('../../GearData/AllGear.json'),
      gearDescriptionInfo: require('../../GearData/GearDescription.json'),
      returnDate: '',
      token:'',
      limit:6,
      firstName:'',
      lastName:'',
      id:'',
      phoneNumber:'',
      loggedIn: false,
      errorMessage : '',
      expand :[false,false,false,false,false],
      gearOptions:'',
      gearDescriptionOptions:[''],
      gearTypeOptions:[''],
      position: 0,
      email :'',
      creditNumber:'',
      expMonth:'',
      expYear:'',
      securityNumber:'',
      expandCode :[''],
      gearSelected :[''],
      gears:[{"gearName": '',
              "gearType": '',
              "quantity": '',
              "gearDescription": '',
              "gearCondition" : ''
              }]
    };
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.onSelectName = this.onSelectName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onClickExpand = this.onClickExpand.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeId = this.onChangeId.bind(this);
    this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this);
    this.onSelectType = this.onSelectType.bind(this);
    this.onSelectQuantity = this.onSelectQuantity.bind(this);
    this.onClickUnExpand = this.onClickUnExpand.bind(this);
    this.onChangeCreditNumber = this.onChangeCreditNumber.bind(this);
    this.onChangeExpMonth = this.onChangeExpMonth.bind(this);
    this.onChangeExpYear = this.onChangeExpYear.bind(this);
    this.onChangeSecurityNumber = this.onChangeSecurityNumber.bind(this);
    this.onChangeReturnDate = this.onChangeReturnDate.bind(this);
    this.onSelectDescription = this.onSelectDescription.bind(this);
    this.onSelectCondition = this.onSelectCondition.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage("chaos_website");
    const {gearInfo} = this.state;
    let {gearOptions} = this.state;
    if(obj && obj.token){
      const token = obj.token;
      fetch('/api/verify?token='+ token)
      .then(res => res.json())
      .then(json => {
        if(json.success){
          gearOptions = gearInfo["GearInfo"].map((gear) =>
                    <option value = {gear.replace(" ","").toLowerCase()} > {gear}< /option>);
          this.setState({
            gearOptions:gearOptions,
            token:token,
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

  onClickUnExpand(){
    let {position, expand, gearTypeOptions,gearDescriptionOptions,gears} = this.state;
    position--;
    expand[position] = false;
    gears.pop();
    gearTypeOptions.pop();
    gearDescriptionOptions.pop();
    this.setState({
      expand:expand,
      gearTypeOptions:gearTypeOptions,
      gearDescriptionOptions:gearDescriptionOptions,
      gears:gears,
      position:position
    });
  }

  onChangeCreditNumber(event) {
    this.setState({
      creditNumber: event.target.value
    });
  }
  onChangeExpMonth(event) {
    this.setState({
      expMonth: event.target.value
    });
  }
  onChangeExpYear(event) {
    this.setState({
      expYear: event.target.value
    });
  }
  onChangeSecurityNumber(event) {
    this.setState({
      securityNumber: event.target.value
    });
  }
  onChangeReturnDate(event) {
    const returnDate = new Date(event.target.value);
    returnDate.setDate(returnDate.getDate() + 1);
    this.setState({
      returnDate: returnDate
    });
  }


  onClickExpand() {
    const {
      position,
      limit
    } = this.state;
    if (position < limit) {
      let {
        expand,
        gearTypeOptions,
        gearDescriptionOptions,
        gears
      } = this.state;
      expand[position] = true;
      gearTypeOptions.push("");
      gearDescriptionOptions.push("");
      var gearTemplate = {
        "gearName": '',
        "gearType": '',
        "quantity": '',
        "gearDescription" :'',
        "gearCondition" :''
      };
      gears.push(gearTemplate);
      this.setState({
        expand: expand,
        gearTypeOptions:gearTypeOptions,
        gearDescriptionOptions:gearDescriptionOptions,
        gears: gears,
        position: position + 1
      });
    }
  }

  onChangeFirstName(event) {
    this.setState({
      firstName: event.target.value
    });
  }

  onChangeLastName(event) {
    this.setState({
      lastName: event.target.value
    });
  }
  onChangeId(event) {
    this.setState({
      id : event.target.value
    });
  }
  onChangePhoneNumber(event) {
    this.setState({
      phoneNumber: event.target.value
    });
  }

  onChangeEmail(event){
    this.setState({
      email:event.target.value
    });
  }

  onSelectName(event){
    var position = parseInt(event.target.id,10);
    let {gearOptions,gears, gearTypeOptions, gearDescriptionOptions} = this.state;
    const {gearData, gearDescriptionInfo} = this.state;
    gearTypeOptions[position] = gearData[event.target.value].map((type) =>
     <option value = {type} > {type}< /option>
     );

    gearDescriptionOptions[position] = gearDescriptionInfo[event.target.value].map((Description) =>
                    <option value = {Description} > {Description}< /option>
                  );
    gears[position]["gearName"]=event.target.value;
    this.setState({
      gearTypeOptions:gearTypeOptions,
      gearDescriptionOptions:gearDescriptionOptions,
      gears:gears
    });
  }
  onSelectDescription(event){
    let {gears}= this.state;
    var position = parseInt(event.target.id,10);
    gears[position]["gearDescription"] = event.target.value;
    this.setState({
      gears:gears
    });
  }
  onSelectCondition(event){
    let {gears}= this.state;
    var position = parseInt(event.target.id,10);
    gears[position]["gearCondition"] = event.target.value;
    this.setState({
      gears:gears
    });
  }
  onSelectQuantity(event){
    let {gears}= this.state;
    var position = parseInt(event.target.id,10);
    gears[position]["quantity"] = parseInt(event.target.value,10);
    this.setState({
      gears:gears
    });
  }
  onSelectType(event){
    let {gears}= this.state;
    var position = parseInt(event.target.id,10);
    gears[position]["gearType"] = event.target.value;
    this.setState({
      gears:gears
    });
  }
  onClickSubmit() {
    const {
      email,
      gears,
      firstName,
      lastName,
      phoneNumber,
      id,
      creditNumber,
      expMonth,
      expYear,
      returnDate,
      securityNumber
    } = this.state;
    fetch('/api/checkoutgear', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          firstName: firstName,
          id: id,
          gears: gears,
          lastName: lastName,
          phoneNumber: phoneNumber,
          ccNumber:creditNumber,
          ccExpMonth:expMonth,
          ccExpYear:expYear,
          ccSecurityNumber: securityNumber,
          returnDate:returnDate,
        })
      }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
          errorMessage: json.message,
          creditNumber:'',
          expMonth:'',
          expYear:'',
          securityNumber:'',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          id:'',
          expand: [false, false, false, false, false],
          position: 0,
          email: '',
          gearSelected: [''],
          gearTypeOptions : [''],
          gearDescriptionOptions : [''],
          gears: [{
            "gearName": '',
            "gearType": '',
            "gearDescription" :'',
            "gearCondition" : '',
            "quantity": ''
          }]
        });
        }
        else {
          this.setState({
            errorMessage: json.message,
          });
        }
      });
  }

  render() {
    const {loggedIn,gears,creditNumber,
      expMonth,expYear,securityNumber,expand,firstName,
      lastName,email,id,phoneNumber,gearData,
      gearSelected,errorMessage, gearOptions,
      gearTypeOptions,gearDescriptionOptions, expandCode} =this.state;
    if(loggedIn){
     return(
               <div class="form-style-5">
{
  (errorMessage) ? (<label >{errorMessage}</label>) :(null)
}
<form>
<fieldset>
<legend><span class="number">1</span> Member Info</legend>
<input type="text" value={firstName} onChange={this.onChangeFirstName} placeholder="First Name *"/>
<input type="text" value={lastName} onChange={this.onChangeLastName} placeholder="Last Name *"/>
<input type="email" value={email} onChange={this.onChangeEmail} placeholder="Your Email *"/>
<input type="text" value={id} onChange={this.onChangeId} placeholder="Student ID/Government ID *"/>
<input type="text" value={phoneNumber} onChange={this.onChangePhoneNumber} placeholder="Phone number *"/>   
</fieldset>
<fieldset>
<legend><span class="number">2</span> Item Checkout Info</legend>
<div>
<label >Item 1:</label>
<select id="0" onChange ={this.onSelectName} value={gears[0]["gearName"]} >
  {
    (gearOptions)
  }
</select>

<label >Brand/Model:</label>

<select id="0" onChange ={this.onSelectType}  value={gears[0]["gearType"]}>
  <option value=""></option>
  {
    (gearTypeOptions[0])
  }
</select> 
<label >Description:</label>
<select id="0" onChange ={this.onSelectDescription}  value={gears[0]["gearDescription"]}>
  <option value=""></option>
  {
    (gearDescriptionOptions[0])
  }
</select>
<label  class="gearConditionLabel" >Condition:</label> <label class="quantityLabel" >Quantity:</label>
<select id="0" class="gearCondition" onChange ={this.onSelectCondition}  value={gears[0]["gearCondition"]}>
  <option value=""></option>
  <option value="new">New</option>
  <option value="moderate">Moderate</option>
  <option value="old">Old</option>
</select>
<select id="0" class="quantity" onChange ={this.onSelectQuantity} value={gears[0]["quantity"]} >
  <option value=""></option>
  <option value="1">1</option>
  <option value="2">2</option>
</select>
</div>

{
  (expand[0]) ? (<div>
  <label >Item 2:</label>
  <select id="1" onChange ={this.onSelectName} value={gears[1]["gearName"]} >
  {
    (gearOptions)
  }
  </select>

  <label >Brand/Model:</label>

  <select id="1" onChange ={this.onSelectType}  value={gears[1]["gearType"]}>
  <option value=""></option>
  {
    (gearTypeOptions[1])
  }
  </select> 
  <label >Description:</label>
  <select id="1" onChange ={this.onSelectDescription}  value={gears[1]["gearDescription"]}>
  <option value=""></option>
  {
    (gearDescriptionOptions[1])
  }
  </select>
  <label  class="gearConditionLabel" >Condition:</label> <label class="quantityLabel" >Quantity:</label>
  <select id="1" class="gearCondition" onChange ={this.onSelectCondition}  value={gears[1]["gearCondition"]}>
  <option value=""></option>
  <option value="new">New</option>
  <option value="moderate">Moderate</option>
  <option value="old">Old</option>
  </select>
  <select id="1" class="quantity" onChange ={this.onSelectQuantity} value={gears[1]["quantity"]} >
  <option value=""></option>
  <option value="1">1</option>
  <option value="2">2</option>
  </select>
  </div>) : (null)
}
{
  (expand[1]) ? (<div>
  <label >Item 3:</label>
  <select id="2" onChange ={this.onSelectName} value={gears[2]["gearName"]} >
  {
    (gearOptions)
  }
  </select>

  <label >Brand/Model:</label>

  <select id="2" onChange ={this.onSelectType}  value={gears[2]["gearType"]}>
  <option value=""></option>
  {
    (gearTypeOptions[2])
  }
  </select> 
  <label >Description:</label>
  <select id="2" onChange ={this.onSelectDescription}  value={gears[2]["gearDescription"]}>
  <option value=""></option>
  {
    (gearDescriptionOptions[2])
  }
  </select>
  <label  class="gearConditionLabel" >Condition:</label> <label class="quantityLabel" >Quantity:</label>
  <select id="2" class="gearCondition" onChange ={this.onSelectCondition}  value={gears[2]["gearCondition"]}>
  <option value=""></option>
  <option value="new">New</option>
  <option value="moderate">Moderate</option>
  <option value="old">Old</option>
  </select>
  <select id="2" class="quantity" onChange ={this.onSelectQuantity} value={gears[2]["quantity"]} >
  <option value=""></option>
  <option value="1">1</option>
  <option value="2">2</option>
  </select>
  </div>) : (null)
}
{
  (expand[2]) ? (<div>
  <label >Item 4:</label>
  <select id="3" onChange ={this.onSelectName} value={gears[3]["gearName"]} >
  {
    (gearOptions)
  }
  </select>

  <label >Brand/Model:</label>

  <select id="3" onChange ={this.onSelectType}  value={gears[3]["gearType"]}>
  <option value=""></option>
  {
    (gearTypeOptions[3])
  }
  </select> 
  <label >Description:</label>
  <select id="3" onChange ={this.onSelectDescription}  value={gears[3]["gearDescription"]}>
  <option value=""></option>
  {
    (gearDescriptionOptions[3])
  }
  </select>
  <label  class="gearConditionLabel" >Condition:</label> <label class="quantityLabel" >Quantity:</label>
  <select id="3" class="gearCondition" onChange ={this.onSelectCondition}  value={gears[3]["gearCondition"]}>
  <option value=""></option>
  <option value="new">New</option>
  <option value="moderate">Moderate</option>
  <option value="old">Old</option>
  </select>
  <select id="3" class="quantity" onChange ={this.onSelectQuantity} value={gears[3]["quantity"]} >
  <option value=""></option>
  <option value="1">1</option>
  <option value="2">2</option>
  </select>
  </div>) : (null)
}
{
  (expand[3]) ? (<div>
  <label >Item 5:</label>
  <select id="4" onChange ={this.onSelectName} value={gears[4]["gearName"]} >
  {
    (gearOptions)
  }
  </select>

  <label >Brand/Model:</label>

  <select id="4" onChange ={this.onSelectType}  value={gears[4]["gearType"]}>
  <option value=""></option>
  {
    (gearTypeOptions[4])
  }
  </select> 
  <label >Description:</label>
  <select id="4" onChange ={this.onSelectDescription}  value={gears[4]["gearDescription"]}>
  <option value=""></option>
  {
    (gearDescriptionOptions[4])
  }
  </select>
  <label  class="gearConditionLabel" >Condition:</label> <label class="quantityLabel" >Quantity:</label>
  <select id="4" class="gearCondition" onChange ={this.onSelectCondition}  value={gears[4]["gearCondition"]}>
  <option value=""></option>
  <option value="new">New</option>
  <option value="moderate">Moderate</option>
  <option value="old">Old</option>
  </select>
  <select id="4" class="quantity" onChange ={this.onSelectQuantity} value={gears[4]["quantity"]} >
  <option value=""></option>
  <option value="1">1</option>
  <option value="2">2</option>
  </select>
  </div>) : (null)
}
{
  (expand[4]) ? (<div>
  <label >Item 6:</label>
  <select id="5" onChange ={this.onSelectName} value={gears[5]["gearName"]} >
  {
    (gearOptions)
  }
  </select>

  <label >Brand/Model:</label>

  <select id="5" onChange ={this.onSelectType}  value={gears[5]["gearType"]}>
  <option value=""></option>
  {
    (gearTypeOptions[5])
  }
  </select> 
  <label >Description:</label>
  <select id="5" onChange ={this.onSelectDescription}  value={gears[5]["gearDescription"]}>
  <option value=""></option>
  {
    (gearDescriptionOptions[5])
  }
  </select>
  <label  class="gearConditionLabel" >Condition:</label> <label class="quantityLabel" >Quantity:</label>
  <select id="5" class="gearCondition" onChange ={this.onSelectCondition}  value={gears[5]["gearCondition"]}>
  <option value=""></option>
  <option value="new">New</option>
  <option value="moderate">Moderate</option>
  <option value="old">Old</option>
  </select>
  <select id="5" class="quantity" onChange ={this.onSelectQuantity} value={gears[5]["quantity"]} >
  <option value=""></option>
  <option value="1">1</option>
  <option value="2">2</option>
  </select>
  </div>) : (null)
}
<button type ="button" class= "add" onClick= {this.onClickExpand}>Add</button>
{ 
 (expand[0]) ? (<button type="button" class ="remove" onClick= {this.onClickUnExpand}>Remove</button>)
  :(null)
}
<label >Return Date:</label>
<input id="date" type="date" onChange={this.onChangeReturnDate}/>
</fieldset>
<fieldset>
<legend><span class="number">3</span> Credit Card Info</legend>
<input class="creditNumber" value={creditNumber} onChange={this.onChangeCreditNumber} placeholder="Credit Card Number *"/>
<input class="expMonth" value={expMonth} onChange={this.onChangeExpMonth} placeholder="MM *"/>   
<input class="expMonth" value={expYear} onChange={this.onChangeExpYear} placeholder="YYYY *"/>   
<input class="securityNumber" value={securityNumber} onChange={this.onChangeSecurityNumber} placeholder="CVV *"/>   
</fieldset>
<input type="button" onClick={this.onClickSubmit} value="Submit" />
</form>
</div>
  	);
	}

}
}

export default CssModules(Checkout, styles);