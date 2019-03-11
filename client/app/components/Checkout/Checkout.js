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
      addManual:true,
      token:'',
      limit:5,
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
      barcodes:[''],
      securityNumber:'',
      gearSelected :[''],
      barcodeExpand:[false,false,false,false,false,false,false,false,false],
      barcodeLimit: 9,
      barcodePosition:0,
      gears:[]
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
    this.onChangeBarcode = this.onChangeBarcode.bind(this);
    this.onClickBarcodeUnExpand = this.onClickBarcodeUnExpand.bind(this);
    this.onClickBarcodeExpand = this.onClickBarcodeExpand.bind(this);
    this.onClickManualAdd = this.onClickManualAdd.bind(this);
    this.onClickRemoveManualAdd = this.onClickRemoveManualAdd.bind(this);
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

  onClickBarcodeUnExpand(){
    let{barcodePosition,barcodeExpand,barcodes} = this.state;
    barcodePosition--;
    if(barcodePosition >= 0){
      barcodeExpand[barcodePosition] = false;
      barcodes.pop();
      this.setState({
        barcodes:barcodes,
        barcodePosition:barcodePosition,
        barcodeExpand:barcodeExpand
      })
    }
  }

  onClickUnExpand(){
    let {position, expand, gearTypeOptions,gearDescriptionOptions,gears} = this.state;
    position--;
    if(position >= 0){
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

  onClickBarcodeExpand(){
    const{barcodePosition,barcodeLimit} = this.state;
    if(barcodePosition < barcodeLimit){
      let {barcodeExpand, barcodes} = this.state;
      barcodeExpand[barcodePosition] = true;
      barcodes.push("");
      this.setState({
        barcodeExpand:barcodeExpand,
        barcodes : barcodes,
        barcodePosition : barcodePosition + 1
      })
    }
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

  onClickManualAdd(event){
    let{gears} = this.state;
    var gearTemplate = {
        "gearName": '',
        "gearType": '',
        "quantity": '',
        "gearDescription" :'',
        "gearCondition" :''
      };
    gears.push(gearTemplate);
    this.setState({
      gears:gears,
      addManual:false
    })
  }

  onClickRemoveManualAdd(event){
      this.setState({
      expand :[false,false,false,false,false],
      gearDescriptionOptions:[''],
      gearTypeOptions:[''],
      position: 0,
      gears:[],
      gearSelected :[''],
      addManual:true
      })
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

  onChangeBarcode(event){
    let {barcodes}= this.state;
    var position = parseInt(event.target.id,10);
    barcodes[position] = event.target.value;
    this.setState({
      barcodes:barcodes
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
      barcodes,
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
          barcodes:barcodes,
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
          barcodes:[''],
          barcodeExpand:[false,false,false,false,false,false,false,false,false],
          barcodePosition:0,
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
      gearTypeOptions,gearDescriptionOptions, expandCode, barcodes,barcodeExpand, addManual} =this.state;
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
<label >Item 1 Barcode:</label>
<input id="0" type="text" value={barcodes[0]} onChange={this.onChangeBarcode} placeholder="Enter barcode *"/>   
</div>
{
  (barcodeExpand[0]) ? (
  <div>
  <label >Item 2 Barcode:</label>
  <input id="1" type="text" value={barcodes[1]} onChange={this.onChangeBarcode} placeholder="Enter barcode *"/>   
  </div>
  ) : (null)
}
{
  (barcodeExpand[1]) ? (
  <div>
  <label >Item 3 Barcode:</label>
  <input id="2" type="text" value={barcodes[2]} onChange={this.onChangeBarcode} placeholder="Enter barcode *"/>   
  </div>
  ) : (null)
}
{
  (barcodeExpand[2]) ? (
  <div>
  <label >Item 4 Barcode:</label>
  <input id="3" type="text" value={barcodes[3]} onChange={this.onChangeBarcode} placeholder="Enter barcode *"/>   
  </div>
  ) : (null)
}

{
  (barcodeExpand[3]) ? (
  <div>
  <label >Item 5 Barcode:</label>
  <input id="4" type="text" value={barcodes[4]} onChange={this.onChangeBarcode} placeholder="Enter barcode *"/>   
  </div>
  ) : (null)
}


{
  (barcodeExpand[4]) ? (
  <div>
  <label >Item 6 Barcode:</label>
  <input id="5" type="text" value={barcodes[5]} onChange={this.onChangeBarcode} placeholder="Enter barcode *"/>   
  </div>
  ) : (null)
}

{
  (barcodeExpand[5]) ? (
  <div>
  <label >Item 7 Barcode:</label>
  <input id="6" type="text" value={barcodes[6]} onChange={this.onChangeBarcode} placeholder="Enter barcode *"/>   
  </div>
  ) : (null)
}

{
  (barcodeExpand[6]) ? (
  <div>
  <label >Item 8 Barcode:</label>
  <input id="7" type="text" value={barcodes[7]} onChange={this.onChangeBarcode} placeholder="Enter barcode *"/>   
  </div>
  ) : (null)
}
{
  (barcodeExpand[7]) ? (
  <div>
  <label >Item 9 Barcode:</label>
  <input id="8" type="text" value={barcodes[8]} onChange={this.onChangeBarcode} placeholder="Enter barcode *"/>   
  </div>
  ) : (null)
}
{
  (barcodeExpand[8]) ? (
  <div>
  <label >Item 10 Barcode:</label>
  <input id="9" type="text" value={barcodes[9]} onChange={this.onChangeBarcode} placeholder="Enter barcode *"/>   
  </div>
  ) : (null)
}
<button type ="button" class= "add" onClick= {this.onClickBarcodeExpand}>Add</button>
<button type="button" class ="remove" onClick= {this.onClickBarcodeUnExpand}>Remove</button>
{
  (addManual) ? (<button type="button" onClick= {this.onClickManualAdd}>Manual Add</button>) :(null)
}

{
  (!addManual) ? (<button type="button" onClick= {this.onClickRemoveManualAdd}>Remove Manual Add</button>) :(null)
}
{
 (!addManual) ? (
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
) :(null)
}
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



{
  (!addManual) ? (<button type="button" class= "add" onClick= {this.onClickExpand}>Add</button>) :(null)
}
{
  (!addManual) ? (<button type="button" class= "remove" onClick= {this.onClickUnExpand}>Remove</button>) :(null)
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