import React,{Component} from 'react';
import CssModules from 'react-css-modules'
import styles from '../../styles/approvalForm.scss';
import {getFromStorage, setInStorage} from '../../utils/storage';
class Download extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      isAdmin: false,
      token:'',
      errorMessage : '',
      excelType:'',
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
                token:token,
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
      excelType:event.target.value
    });
  }

  onClickSubmit() {
    const {
      excelType,token
    } = this.state;
    if(!excelType){
      this.setState({
        errorMessage:'Please select excel type'
      });
    }
    else{
    fetch('/api/' + excelType + '?token=' + token)
      .then(res => res.json())
      .then(json => {
      if (json.success) {
        var results = json.results;
        var template = require("../../GearData/"+excelType+".json");
        var fields = Object.keys(template);
        var replacer = function(key, value) {
          return value === null ? '' : value
        };
        var csv = results.map(function(row) {
          return fields.map(function(fieldName) {
            if(fieldName == 'gears' || fieldName == 'damagedGear'){
              var gearTemplate = {'gearName':'','gearType':'','gearPrice':''};
              var gearField= Object.keys(gearTemplate);
              var gears = row[fieldName];
              return gears.map(function(row){
                return gearField.map(function(gearFieldName){
                  return JSON.stringify(row[gearFieldName],replacer);
                }).join(',');
              });
            }
            else{
              return JSON.stringify(row[fieldName], replacer);
            }
          }).join(',');
        });
        csv.unshift(fields.join(','));
        csv =csv.join('\r\n');
        var encodedUri = encodeURI(csv);
        var element = document.createElement("a");
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
        element.setAttribute('download', excelType+'.csv');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
      }
      });
    }
}

  render() {
    const {loggedIn,isAdmin, errorMessage,email,excelType} =this.state;
    if(loggedIn && isAdmin){
     return(
      <div class="form-style-5">
<form>
<fieldset>
{
  (errorMessage) ? (<p>{errorMessage}</p>) : (null)
}
<legend><span class="number">1</span> Download Info</legend>   
<label >Select which excel file:</label>
<select value={excelType} onChange ={this.onSelectChangeNewValue} >
  <option value=""></option>
  <option value="latemember">Overdue Members</option>
  <option value="checkedout">Members with gears</option>
  <option value="gearavailable">Gear Available</option>
  <option value="returnforms">Returns with comments</option>
  <option value="damagedsheet">Damaged/Lost gears by members</option>
</select> 
</fieldset>
<input type="button" value="Download" onClick = {this.onClickSubmit} />
</form>
</div>
  	);
	}
}
}

export default CssModules(Download, styles);