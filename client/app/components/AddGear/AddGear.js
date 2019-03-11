import React,{Component} from 'react';
import CssModules from 'react-css-modules'
import styles from '../../styles/approvalForm.scss';
import {getFromStorage, setInStorage} from '../../utils/storage';
class AddGear extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      gearSelected:'',
      gearData: require('../../GearData/GearData.json'),
      gearInfo: require('../../GearData/AllGear.json'),
      gearDescriptionInfo: require('../../GearData/GearDescription.json'),
      gearDescription:'',
      gearType:'',
      gearOptions:'',
      gearDescriptionOptions:'',
      gearTypeOptions:'',
      gearCondition:'',
      barcode:'',
      gearPrice:''
    };
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.onSelectGear = this.onSelectGear.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onSelectType = this.onSelectType.bind(this);
    this.onSelectDescription = this.onSelectDescription.bind(this);
    this.onSelectCondition = this.onSelectCondition.bind(this);
    this.onChangeBarcode = this.onChangeBarcode.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage("chaos_website");
    const {gearInfo} = this.state;
    if(obj && obj.token){
      const token = obj.token;
      fetch('/api/verify?token='+ token)
      .then(res => res.json())
      .then(json => {
        if(json.success){
          let gearOptions = gearInfo["GearInfo"].map((gear) =>
                    <option value = {gear.replace(" ", "").toLowerCase()} > {gear}< /option>
                  );
          this.setState({
            gearOptions:gearOptions,
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
  onChangePrice(event){
    this.setState({
      gearPrice:event.target.value
    });
  }

  onSelectDescription(event){
    this.setState({
      gearDescription:event.target.value
    })
  }

  onChangeBarcode(event){
    this.setState({
      barcode:event.target.value
    })
  }

  onSelectCondition(event){
    this.setState({
      gearCondition:event.target.value
    })
  }

  onSelectGear(event){
    const {gearData, gearDescriptionInfo} = this.state;
    this.setState({
      gearSelected:event.target.value,
    });
  }
  onSelectType(event){
    this.setState({
      gearType:event.target.value
    });
  }
  onClickSubmit() {
    const {
      gearSelected,
      gearType,
      gearPrice,
      gearDescription,
      gearCondition,
      barcode
    } = this.state;
    fetch('/api/addgear', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gearName: gearSelected,
          gearType: gearType,
          gearPrice: gearPrice,
          gearDescription: gearDescription,
          gearCondition: gearCondition,
          barcode: barcode
        })
      }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            gearSelected: '',
            errorMessage: json.message,
            gearType: '',
            gearPrice:'',
            gearDescription:'',
            gearCondition: '',
            barcode:''
          })
        } else {
          this.setState({
            errorMessage: json.message,
          });
        }
      });
  }
  render() {
    const {loggedIn, errorMessage,email,gearSelected,
     gearData,gearType,
     gearPrice,gearOptions,
     gearDescription,
     gearTypeOptions, gearDescriptionOptions, gearCondition, barcode} =this.state;
    if(loggedIn ){
     return(
      <div class="form-style-5">
<form>
<fieldset>
{
  (errorMessage) ? (<p>{errorMessage}</p>) : (null)
}
<legend><span class="number">1</span> Add Gear</legend>
<label >Gear:</label>
<select value={gearSelected} onChange ={this.onSelectGear} >
  {
    (gearOptions)
  }
</select> 
<label >Brand/Model:</label>
<input type="text" onChange ={this.onSelectType}  value={gearType}/>
<label >Barcode:</label>
<input type="text" onChange ={this.onChangeBarcode}  value={barcode}/>
<label >Description:</label>
<input type="text" onChange ={this.onSelectDescription}  value={gearDescription}/>
<label  class= "gearConditionLabel">Condition:</label> <label class="quantityLabel" >Price:</label>
<select id="0" class="gearCondition" onChange ={this.onSelectCondition}  value={gearCondition}>
  <option value=""></option>
  <option value="new">New</option>
  <option value="moderate">Moderate</option>
  <option value="old">Old</option>
</select>
<input class="quantity" onChange={this.onChangePrice} value={gearPrice} placeholder="Price *"/>
</fieldset>
<input type="button" value="Submit" onClick = {this.onClickSubmit} />
</form>
</div>
    );
  }
}
}

export default CssModules(AddGear, styles);