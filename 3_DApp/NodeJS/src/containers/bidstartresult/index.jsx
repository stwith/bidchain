import React from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import { simpleStoreContract } from '../../simpleStore'
import nervos from '../../nervos'
import transaction from '../../contracts/transaction'



class bidstartresult extends React.Component {
  
  state = {
    projName:"",
    projMargin:0,
    projDoc:"",
    tenderStart:0,
    tenderConfirm:0,
    tenderEnd:0,
    cancelNum: 0


  }

  

  handleSubmit = e => {
    console.log(this);
    
    const { projName, projMargin,projDoc, tenderStart,tenderConfirm,tenderEnd,cancelNum} = this.state
    nervos.appchain
      .getBlockNumber()
      .then(current => {
        const tx = {
          ...transaction,
          validUntilBlock: +current + 88,
        }
        // this.setState({
        //   submitText: submitTexts.submitting,
        // })
        this.state.projName = simpleStoreContract.methods.uploadStandard(cancelNum, projMargin,projDoc,tenderStart,tenderConfirm,tenderEnd,projName).send(tx)
        // return simpleStoreContract.methods.margin().call(tx)
      })
      .then(res => {
         console.log(res)
        if (res.hash) {
          this.props.history.push("/bidstartresult")
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
    const { times, texts } = this.state
    return (
        <div class="container"> 
  
        <header> <a href="index.html">
          <h4 class="logo"><img width="120" src="img/logo.png"  alt="BidChain System" /></h4>
          </a>
          <nav>
            <ul>
              <li><a href="index.html">首页</a></li>
              <li><a href="bidstart.html">招标</a></li>
              <li> <a href="bidsubmit.html">投标</a></li>
            </ul>
          </nav>
        </header>
  
          <h1></h1>
          <div style={{'text-align': 'center'}}>
          <p>请求提交成功，您项目的Session ID为</p>
          
          </div>
      
          
          
          <h1><div></div></h1>
   
        <div class="copyright">&copy;2018 - Team Pyxis</div>
      </div>
    )
  }
}
export default bidstartresult
