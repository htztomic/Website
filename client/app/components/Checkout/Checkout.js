import React,{Component} from 'react';
import CssModules from 'react-css-modules'
import styles from '../../styles/homeStyle.scss';
import {getFromStorage, setInStorage} from '../../utils/storage';
class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gearData:require('../../GearData/GearData.json'),
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
      position: 0,
      email :'',
      creditNumber:'',
      expMonth:'',
      expYear:'',
      securityNumber:'',
      gearSelected :[''],
      gears:[{"gearName":'',
              "gearType":'',
              "quantity":''
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
    let {position, expand, gearSelected,gears} = this.state;
    position--;
    expand[position] = false;
    gears.pop();
    gearSelected.pop();
    this.setState({
      expand:expand,
      gearSelected:gearSelected,
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
        gearSelected,
        gears
      } = this.state;
      expand[position] = true;
      gearSelected.push("");
      var gearTemplate = {
        "gearName": '',
        "gearType": '',
        "quantity": ''
      };
      gears.push(gearTemplate);
      this.setState({
        expand: expand,
        gearSelected: gearSelected,
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
    let {gearSelected,gears} = this.state;
    gears[position]["gearName"]=event.target.value;
    gearSelected[position] =event.target.value;
    this.setState({
      gearSelected:gearSelected,
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
          gears: [{
            "gearName": '',
            "gearType": '',
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
    const {loggedIn,gears,creditNumber,expMonth,expYear,securityNumber,expand,firstName,lastName,email,id,phoneNumber,gearData,gearSelected,errorMessage} =this.state;
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
<label >Item 1:</label>
<select id="0" onChange ={this.onSelectName} value={gears[0]["gearName"]} >
  <option value=""></option>
  <option value="Sleeping Bag">Sleeping Bag</option>
  <option value="Tent">Tent</option>
  <option value="Sleeping Pad">Sleeping Pad</option>
  <option value="Water Filter">Water Filter</option>
  <option value="Backpack">Backpack</option>
  <option value="Daypack">Daypack</option>
  <option value="Poles">Poles</option>
  <option value="Headlamp">Headlamp</option>
  <option value="Backpacking Stoves">Backpacking Stoves</option>
  <option value="Camping Stove">Camping Stove</option>
  <option value="Hammock">Hammock</option>
  <option value="Bear Can">Bear Can</option>
  <option value="Ground Tarp">Ground Tarp</option>
  <option value="Tarp tent">Tarp tent</option>
  <option value="Climbing Helmet">Climbing Helmet</option>
  <option value="Climbing Shoes">Climbing Shoes</option>
  <option value="Snowshoes">Snowshoes</option>
  <option value="Ice Axes">Ice Axes</option>
  <option value="Avalanche Beacon">Avalanche Beacon</option>
  <option value="Crampons">Crampons</option>
  <option value="Pots/Pans">Pots/Pans</option>
</select> 
<label  class= "gearTypeLabel">Type:</label> <label class="quantityLabel" >Quantity:</label>
<select id="0" class="gearType" onChange ={this.onSelectType}  value={gears[0]["gearType"]}>
  <option value=""></option>
  <option value={gearData[gearSelected[0]][0]}>{gearData[gearSelected[0]][0]}</option>
  <option value={gearData[gearSelected[0]][1]}>{gearData[gearSelected[0]][1]}</option>
</select> 
<select id="0" class="quantity" onChange ={this.onSelectQuantity} value={gears[0]["quantity"]} >
  <option value=""></option>
  <option value="1">1</option>
  <option value="2">2</option>
</select> 
{
  (expand[0]) ? (<label >Item 2:</label>) :(null)
}
{
  (expand[0]) ? (
  <select id="1" onChange ={this.onSelectName}  value={gears[1]["gearName"]}  >
  <option value=""></option>
  <option value="Sleeping Bag">Sleeping Bag</option>
  <option value="Tent">Tent</option>
  <option value="Sleeping Pad">Sleeping Pad</option>
  <option value="Water Filter">Water Filter</option>
  <option value="Backpack">Backpack</option>
  <option value="Daypack">Daypack</option>
  <option value="Poles">Poles</option>
  <option value="Headlamp">Headlamp</option>
  <option value="Backpacking Stoves">Backpacking Stoves</option>
  <option value="Camping Stove">Camping Stove</option>
  <option value="Hammock">Hammock</option>
  <option value="Bear Can">Bear Can</option>
  <option value="Ground Tarp">Ground Tarp</option>
  <option value="Tarp tent">Tarp tent</option>
  <option value="Climbing Helmet">Climbing Helmet</option>
  <option value="Climbing Shoes">Climbing Shoes</option>
  <option value="Snowshoes">Snowshoes</option>
  <option value="Ice Axes">Ice Axes</option>
  <option value="Avalanche Beacon">Avalanche Beacon</option>
  <option value="Crampons">Crampons</option>
  <option value="Pots/Pans">Pots/Pans</option>
</select> 
  ) : (null)
}

{
  (expand[0]) ? (<label class="gearTypeLabel" >Type:</label>) :(null)
}
{
  (expand[0]) ? (<label class="quantityLabel">Quantity:</label>) :(null)
}
{
  (expand[0]) ? (
  <select id="1" class="gearType" onChange ={this.onSelectType}  value={gears[1]["gearType"]}>
  <option value=""></option>
  <option value={gearData[gearSelected[1]][0]}>{gearData[gearSelected[1]][0]}</option>
  <option value={gearData[gearSelected[1]][1]}>{gearData[gearSelected[1]][1]}</option>
</select> ) :(null)
}
{
  (expand[0]) ? (
  <select id="1" class="quantity" onChange ={this.onSelectQuantity} value={gears[1]["quantity"]} >
  <option value=""></option>
  <option value="1">1</option>
  <option value="2">2</option>
</select>  ) :(null)
}

{
  (expand[1]) ? (<label >Item 3:</label>) :(null)
}
{
  (expand[1]) ? (
  <select id="2" onChange ={this.onSelectName}  value={gears[2]["gearName"]}  >
  <option value=""></option>
  <option value="Sleeping Bag">Sleeping Bag</option>
  <option value="Tent">Tent</option>
  <option value="Sleeping Pad">Sleeping Pad</option>
  <option value="Water Filter">Water Filter</option>
  <option value="Backpack">Backpack</option>
  <option value="Daypack">Daypack</option>
  <option value="Poles">Poles</option>
  <option value="Headlamp">Headlamp</option>
  <option value="Backpacking Stoves">Backpacking Stoves</option>
  <option value="Camping Stove">Camping Stove</option>
  <option value="Hammock">Hammock</option>
  <option value="Bear Can">Bear Can</option>
  <option value="Ground Tarp">Ground Tarp</option>
  <option value="Tarp tent">Tarp tent</option>
  <option value="Climbing Helmet">Climbing Helmet</option>
  <option value="Climbing Shoes">Climbing Shoes</option>
  <option value="Snowshoes">Snowshoes</option>
  <option value="Ice Axes">Ice Axes</option>
  <option value="Avalanche Beacon">Avalanche Beacon</option>
  <option value="Crampons">Crampons</option>
  <option value="Pots/Pans">Pots/Pans</option>
</select> 
  ) : (null)
}

{
  (expand[1]) ? (<label class="gearTypeLabel" >Type:</label>) :(null)
}
{
  (expand[1]) ? (<label class="quantityLabel" >Quantity:</label>) :(null)
}
{
  (expand[1]) ? (
  <select id="2" class="gearType" onChange ={this.onSelectType}  value={gears[2]["gearType"]}>
  <option value=""></option>
  <option value={gearData[gearSelected[2]][0]}>{gearData[gearSelected[2]][0]}</option>
  <option value={gearData[gearSelected[2]][1]}>{gearData[gearSelected[2]][1]}</option>
</select> ) :(null)
}
{
  (expand[1]) ? (
  <select id="2" class="quantity" onChange ={this.onSelectQuantity} value={gears[2]["quantity"]} >
  <option value=""></option>
  <option value="1">1</option>
  <option value="2">2</option>
</select>  ) :(null)
}

{
  (expand[2]) ? (<label >Item 4:</label>) :(null)
}
{
  (expand[2]) ? (
  <select id="3" onChange ={this.onSelectName}  value={gears[3]["gearName"]}  >
  <option value=""></option>
  <option value="Sleeping Bag">Sleeping Bag</option>
  <option value="Tent">Tent</option>
  <option value="Sleeping Pad">Sleeping Pad</option>
  <option value="Water Filter">Water Filter</option>
  <option value="Backpack">Backpack</option>
  <option value="Daypack">Daypack</option>
  <option value="Poles">Poles</option>
  <option value="Headlamp">Headlamp</option>
  <option value="Backpacking Stoves">Backpacking Stoves</option>
  <option value="Camping Stove">Camping Stove</option>
  <option value="Hammock">Hammock</option>
  <option value="Bear Can">Bear Can</option>
  <option value="Ground Tarp">Ground Tarp</option>
  <option value="Tarp tent">Tarp tent</option>
  <option value="Climbing Helmet">Climbing Helmet</option>
  <option value="Climbing Shoes">Climbing Shoes</option>
  <option value="Snowshoes">Snowshoes</option>
  <option value="Ice Axes">Ice Axes</option>
  <option value="Avalanche Beacon">Avalanche Beacon</option>
  <option value="Crampons">Crampons</option>
  <option value="Pots/Pans">Pots/Pans</option>
</select> 
  ) : (null)
}

{
  (expand[2]) ? (<label class="gearTypeLabel" >Type:</label>) :(null)
}
{
  (expand[2]) ? (<label class="quantityLabel" >Quantity:</label>) :(null)
}
{
  (expand[2]) ? (
  <select id="3" class="gearType" onChange ={this.onSelectType}  value={gears[3]["gearType"]}>
  <option value=""></option>
  <option value={gearData[gearSelected[3]][0]}>{gearData[gearSelected[3]][0]}</option>
  <option value={gearData[gearSelected[3]][1]}>{gearData[gearSelected[3]][1]}</option>
</select> ) :(null)
}

{
  (expand[2]) ? (
  <select id="3" class="quantity" onChange ={this.onSelectQuantity} value={gears[3]["quantity"]} >
  <option value=""></option>
  <option value="1">1</option>
  <option value="2">2</option>
</select>  ) :(null)
}

{
  (expand[3]) ? (<label >Item 5:</label>) :(null)
}
{
  (expand[3]) ? (
  <select id="4" onChange ={this.onSelectName}  value={gears[4]["gearName"]}  >
  <option value=""></option>
  <option value="Sleeping Bag">Sleeping Bag</option>
  <option value="Tent">Tent</option>
  <option value="Sleeping Pad">Sleeping Pad</option>
  <option value="Water Filter">Water Filter</option>
  <option value="Backpack">Backpack</option>
  <option value="Daypack">Daypack</option>
  <option value="Poles">Poles</option>
  <option value="Headlamp">Headlamp</option>
  <option value="Backpacking Stoves">Backpacking Stoves</option>
  <option value="Camping Stove">Camping Stove</option>
  <option value="Hammock">Hammock</option>
  <option value="Bear Can">Bear Can</option>
  <option value="Ground Tarp">Ground Tarp</option>
  <option value="Tarp tent">Tarp tent</option>
  <option value="Climbing Helmet">Climbing Helmet</option>
  <option value="Climbing Shoes">Climbing Shoes</option>
  <option value="Snowshoes">Snowshoes</option>
  <option value="Ice Axes">Ice Axes</option>
  <option value="Avalanche Beacon">Avalanche Beacon</option>
  <option value="Crampons">Crampons</option>
  <option value="Pots/Pans">Pots/Pans</option>
</select> 
  ) : (null)
}

{
  (expand[3]) ? (<label class="gearTypeLabel" >Type:</label>) :(null)
}
{
  (expand[3]) ? (<label class="quantityLabel" >Quantity:</label>) :(null)
}
{
  (expand[3]) ? (
  <select id="4" class="gearType" onChange ={this.onSelectType}  value={gears[4]["gearType"]}>
  <option value=""></option>
  <option value={gearData[gearSelected[4]][0]}>{gearData[gearSelected[4]][0]}</option>
  <option value={gearData[gearSelected[4]][1]}>{gearData[gearSelected[4]][1]}</option>
</select> ) :(null)
}

{
  (expand[3]) ? (
  <select id="4" class="quantity" onChange ={this.onSelectQuantity} value={gears[4]["quantity"]} >
  <option value=""></option>
  <option value="1">1</option>
  <option value="2">2</option>
</select>  ) :(null)
}
{
  (expand[4]) ? (<label >Item 6:</label>) :(null)
}
{
  (expand[4]) ? (
  <select id="5" onChange ={this.onSelectName}  value={gears[5]["gearName"]}  >
  <option value=""></option>
  <option value="Sleeping Bag">Sleeping Bag</option>
  <option value="Tent">Tent</option>
  <option value="Sleeping Pad">Sleeping Pad</option>
  <option value="Water Filter">Water Filter</option>
  <option value="Backpack">Backpack</option>
  <option value="Daypack">Daypack</option>
  <option value="Poles">Poles</option>
  <option value="Headlamp">Headlamp</option>
  <option value="Backpacking Stoves">Backpacking Stoves</option>
  <option value="Camping Stove">Camping Stove</option>
  <option value="Hammock">Hammock</option>
  <option value="Bear Can">Bear Can</option>
  <option value="Ground Tarp">Ground Tarp</option>
  <option value="Tarp tent">Tarp tent</option>
  <option value="Climbing Helmet">Climbing Helmet</option>
  <option value="Climbing Shoes">Climbing Shoes</option>
  <option value="Snowshoes">Snowshoes</option>
  <option value="Ice Axes">Ice Axes</option>
  <option value="Avalanche Beacon">Avalanche Beacon</option>
  <option value="Crampons">Crampons</option>
  <option value="Pots/Pans">Pots/Pans</option>
</select> 
  ) : (null)
}

{
  (expand[4]) ? (<label class="gearTypeLabel">Type:</label>) :(null)
}
{
  (expand[4]) ? (<label class="quantityLabel">Quantity:</label>) :(null)
}
{
  (expand[4]) ? (
  <select id="5" class="gearType" onChange ={this.onSelectType}  value={gears[5]["gearType"]}>
  <option value=""></option>
  <option value={gearData[gearSelected[5]][0]}>{gearData[gearSelected[5]][0]}</option>
  <option value={gearData[gearSelected[5]][1]}>{gearData[gearSelected[5]][1]}</option>
</select> ) :(null)
}
{
  (expand[4]) ? (
  <select id="5" class="quantity" onChange ={this.onSelectQuantity} value={gears[5]["quantity"]} >
  <option value=""></option>
  <option value="1">1</option>
  <option value="2">2</option>
</select>  ) :(null)
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