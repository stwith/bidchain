import React from 'react'
import logo from '../../public/images/logo.svg'
import BottomNav from '../../components/BottomNav'

import { Link } from 'react-router-dom'
import nervos from '../../nervos'
import transaction from '../../contracts/transaction'
import {simpleStoreContract} from '../../simpleStore'

class Bidstartportal extends React.Component{
  state = {

  }

  handlefinish = e => {
    console.log(this);
    
    nervos.appchain
      .getBlockNumber()
      .then(current => {
        const tx = {
          ...transaction,
          from: window.nervos.appchain.defaultAccount,
          validUntilBlock: +current + 88,
        }

        return simpleStoreContract.methods.finishTender().send(tx)
        // return simpleStoreContract.methods.margin().call(tx)
      })
      .then(res => {
         console.log(res)
        if (res.hash) {
          // this.props.history.push("/bidstartresult")
          return nervos.listeners.listenToTransactionReceipt(res.hash)
        } else {
          throw new Error('No Transaction Hash Received')
        }
      })
      .then(receipt => {
        if (!receipt.errorMessage) {
          // this.setState({ submitText: submitTexts.submitted })
        } else {
          throw new Error(receipt.errorMessage)
        }
      })
      .catch(err => {
        console.log(err)
        // this.setState({ errorText: JSON.stringify(err) })
      })
      
  }


  render() {
    
    
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
    
      <section class="hero" id="hero">
        <h2 class="hero_header">无 竞</h2>
        <p class="tagline">请选择招标项目操作</p>
        <div class="btn_mid">
          <Link to="/bidstart">
            <div class="button" id="start" >发起招标</div>
          </Link>
        </div>
        <div class="btn_mid">
          <Link to="/bidinvitedetail">
            <div class="button" id="enquiry" >查询项目招标状态</div>
          </Link>
        </div>
    
        <div class="btn_mid">
            <div class="button" id="enquiry" onClick={this.handlefinish}>结束招标</div>
        </div>
    
        
      </section>
    
      <div class="copyright">&copy;2018 - Team Pyxis</div>
    </div>
    
      
    
    )
  }
}
export default Bidstartportal




