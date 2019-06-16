import React,{Component} from 'react';
import CssModules from 'react-css-modules'
import styles from '../../styles/navBarStyle.scss';
import {getFromStorage, setInStorage} from '../../utils/storage';
import { Link } from 'react-router-dom';
class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loggedIn: false,
			isAdmin: false,
			active: {
				"/": "",
				"/Approval": "",
				"/Forms": "dropbtn",
				"/Admin":"dropbtn"
			}
		};
		this.onClickSignOut = this.onClickSignOut.bind(this);
	}

	componentDidMount() {
		const obj = getFromStorage("chaos_website");
		const path = window.location.pathname;
		let {
			active
		} = this.state;
		if (path.search("Forms") != -1) {
			active["/Forms"] = "activedropbtn";
		}
		else if(path.search("Admin") != -1){
			active["/Admin"]= "activedropbtn"
		}
		else {
			active[path] = "active";
		}
		this.setState({
			active: active
		});
		if (obj && obj.token) {
			const token = obj.token;
			fetch('/api/verify?token=' + token)
				.then(res => res.json())
				.then(json => {
					if (json.success) {
						this.setState({
							loggedIn: true,
							isAdmin: json.isAdmin
						});
					} else {
						this.setState({
							loggedIn: false
						});
					}
				});
		} else {
			this.setState({
				loggedIn: false
			});
		}
	}

	onClickSignOut() {
		const obj = getFromStorage("chaos_website");
		if (obj && obj.token) {
			const token = obj.token;
			fetch('/api/signout?token=' + token)
				.then(res => res.json())
				.then(json => {
					if (json.success) {
						this.setState({
							loggedIn: false,
						});
						window.location.href = '/'
					} else {
						this.setState({
							loggedIn: true
						});
					}
				});
		} else {
			this.setState({
				loggedIn: true
			});
		}
	}

  render() {
    const {loggedIn,isAdmin,active} =this.state;
    if(loggedIn){
     return(<header>
    <div class="topnav">
  	<a class={active["/"]} href="/">Home</a>
  	<div class="dropdown">
    <button class={active['/Forms']}>Forms 
      <i class="fa fa-caret-down"></i>
    </button>
    <div class="dropdown-content">
      <a href="/Forms/Checkout">Checkout Gear</a>
      <a href="/Forms/AddGear">Add Gear to Database</a>
      <a href="/Forms/AddMember">Add Member</a>
      <a href="/Forms/ReturnGear">Return Gear</a>
    </div>
  	</div> 
  	{
  		(isAdmin) ? (
  			<div class="dropdown">
    		<button class={active['/Admin']}>Admin 
      		<i class="fa fa-caret-down"></i>
    		</button>
    		<div class="dropdown-content">
      		<a href="/Admin/Approval">Approval</a>
      		<a href="/Admin/Download">Download Excel</a>
      		<a href="/Admin/EditReturn">Edit Returns</a>
    		</div>
  			</div>) : (null)
  	}
  	<a href="/" onClick ={this.onClickSignOut}>Logout</a>
	</div>
  	</header>
  	);
	}
}
}

export default CssModules(Header, styles);