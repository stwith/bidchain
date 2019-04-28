import React from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import { simpleStoreContract } from '../../simpleStore'
import nervos from '../../nervos'


const Record = ({ time, text, hasYearLabel }) => {
  const _time = new Date(+time)
  return (
    <div className="list__record--container">
      {hasYearLabel ? <div className="list__record--year">{_time.getFullYear()}</div> : null}
      <span>{`${_time.getMonth() + 1}-${_time.getDate()} ${_time.getHours()}:${_time.getMinutes()}`}</span>
      <Link to={`/show/${time}`}>
        <div>{text}</div>
      </Link>
    </div>
  )
}

class List extends React.Component {
  state = {
    times: [],
    texts: [],
  }
  componentDidMount() {
    const from = nervos.eth.accounts.wallet[0] ? nervos.eth.accounts.wallet[0].address : ''
    simpleStoreContract.methods
      .getList()
      .call({
        from,
      })
      .then(times => {
        times.reverse()
        this.setState({ times })
        return Promise.all(times.map(time => simpleStoreContract.methods.get(time).call({ from })))
      })
      .then(texts => {
        this.setState({ texts })
      })
      .catch(console.error)
  }
  render() {
    const { times, texts } = this.state
    return (
        <div class="container"> 

  <header> <a href="index.html">
    <h4 class="logo"><img width="120" src="img/logo.png"  alt="BidChain System" /></h4>
    </a>
    <nav>
      <ul>
        <li><a href="index.html">首页</a></li>
        <li><a href="bidstartportal.html">招标</a></li>
        <li> <a href="bidsubmitportal.html">投标</a></li>
      </ul>
    </nav>
  </header>
	<h1></h1>
	<div style={{'text-align': 'center'}}>
	<p>请输入您拥有项目的Session ID</p>
		<div><input/></div>
    <Link to="bidinvitedetail">
		  <button>查询</button>
    </Link>
	</div>

	
	
	<h1><div></div></h1>
  <div class="copyright">&copy;2018 - Team Pyxis</div>
</div>
    )
  }
}
export default List
