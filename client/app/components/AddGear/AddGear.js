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
      gearType:'',
      gearPrice:''
    };
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.onSelectGear = this.onSelectGear.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onSelectType = this.onSelectType.bind(this);
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
  onChangePrice(event){
    this.setState({
      gearPrice:event.target.value
    });
  }

  onSelectGear(event){
    this.setState({
      gearSelected:event.target.value
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
      gearPrice
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
          gearPrice: gearPrice
        })
      }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            gearSelected: '',
            errorMessage: json.message,
            gearType: '',
            gearPrice:''
          })
        } else {
          this.setState({
            errorMessage: json.message,
          });
        }
      });
  }
  render() {
    const {loggedIn, errorMessage,email,gearSelected, gearData,gearType, gearPrice} =this.state;
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
<label  class= "gearTypeLabel">Type:</label> <label class="quantityLabel" >Price:</label>
<select id="0" class="gearType" onChange ={this.onSelectType}  value={gearType}>
  <option value=""></option>
  <option value={gearData[gearSelected][0]}>{gearData[gearSelected][0]}</option>
  <option value={gearData[gearSelected][1]}>{gearData[gearSelected][1]}</option>
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