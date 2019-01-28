import React from 'react';
import { render } from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import App from './components/App/App';
import NotFound from './components/App/NotFound';

import Home from './components/Home/Home';

import SignUp from './components/SignUp/SignUp';

import Approval from './components/Approval/Approval';

import Checkout from './components/Checkout/Checkout';

import AddGear from './components/AddGear/AddGear';

import ReturnGear from './components/ReturnGear/ReturnGear';

import Download from './components/Download/Download';

import AddMember from './components/AddMember/AddMember';

import EditReturn from './components/EditReturn/EditReturn';

import './styles/styles.scss';

render((
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/SignUp" component={SignUp}/>
        <Route path="/Admin/Approval" component={Approval}/>
        <Route path="/Admin/EditReturn" component={EditReturn}/>
        <Route path="/Admin/Download" component={Download}/>
        <Route path="/Forms/AddMember" component={AddMember}/>
        <Route path="/Forms/Checkout" component={Checkout}/>
        <Route path="/Forms/AddGear" component={AddGear}/>
        <Route path="/Forms/ReturnGear" component={ReturnGear}/>
        <Route component={NotFound}/>
      </Switch>
    </App>
  </Router>
), document.getElementById('app'));
