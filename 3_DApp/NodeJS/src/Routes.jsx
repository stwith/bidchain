import React from 'react'
import { Router, Route, Switch } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import Home from './containers/Home'
import Add from './containers/Add'
import Show from './containers/Show'
import List from './containers/List'
import bidstartportal from './containers/bidstartportal'
import bidstart from './containers/bidstart'
import bidstartresult from './containers/bidstartresult'
import bidinviteenquiry from './containers/bidinviteenquiry'
import bitinvitedetail from './containers/bidinvitedetail'
import Bidinvitedetail from './containers/bidinvitedetail';

import bidsubmitportal from './containers/bidsubmitportal'
import bidsubmit from './containers/bidsubmit'

// import bidsubmitportal from './containers/bidsubmitportal'
const history = createBrowserHistory()

const router = App => (
  <Router history={history}>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/index.html" exact component={Home} />
      <Route path="/bidstartportal" exact component={bidstartportal} />
      <Route path="/bidstartportal.html" exact component={bidstartportal} />
      <Route path="/bidstart" exact component={bidstart} />
      <Route path="/bidstartresult" exact component={bidstartresult} />
      <Route path="/bidinviteenquiry" exact component={bidinviteenquiry} />

      <Route path="/bidinvitedetail" exact component={Bidinvitedetail} />
      <Route path="/bidsubmit" exact component={bidsubmit} />
      <Route path="/bidsubmitportal" exact component={bidsubmitportal} />
      <Route path="/bidsubmitportal.html" exact component={bidsubmitportal} />
      
      <Route path="/add" exact component={Add} />
      <Route path="/list" exact component={List} />
      <Route path="/show/:time" exact component={Show} />
    </Switch>
  </Router>
)

export default router
