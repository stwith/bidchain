import React from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import { simpleStoreContract } from '../../simpleStore'
import nervos from '../../nervos'
import transaction from '../../contracts/transaction'



class Bidstart extends React.Component {
  
  state = {
    projName:"",
    projMargin:0,
    projDoc:"",
    tenderStart:0,
    tenderConfirm:0,
    tenderEnd:0,
    cancelNum: 0,
    token:""
  }

  setprojName = e => {
    this.setState({projName: e.target.value})
    console.log(e.target.value)
  }
  setprojMargin = e => {
    this.setState({projMargin: e.target.value})
    console.log(e.target.value)
  }
  setprojDoc = e => {
    this.setState({projDoc: e.target.value})
    console.log(e.target.value)
  }
  settenderStart = e => {
    this.setState({tenderStart: Date.parse(e.target.value)})
    console.log(new Date(Date.parse(e.target.value)))
  }
  settenderConfirm = e => {
    this.setState({tenderConfirm: Date.parse(e.target.value)})
    console.log(new Date(Date.parse(e.target.value)))
  }
  settenderEnd = e => {
    this.setState({tenderEnd: Date.parse(e.target.value)})
    console.log(new Date(Date.parse(e.target.value)))
  }
  setcancelNum = e => {
    this.setState({cancelNum: e.target.value})
    console.log(e.target.value)
  }

  settoken = e =>{
    this.setState({token:e.target.value})
  }

  handleSubmit = e => {
    console.log(this);
    
    const { projName, projMargin,projDoc, tenderStart,tenderConfirm,tenderEnd,cancelNum} = this.state
    nervos.appchain
      .getBlockNumber()
      .then(current => {
        const tx = {
          ...transaction,
          from: window.nervos.appchain.defaultAccount,
          validUntilBlock: +current + 88,
        }
        // this.setState({
        //   submitText: submitTexts.submitting,
        // })
        return simpleStoreContract.methods.uploadStandard(cancelNum, projMargin,tenderStart,tenderConfirm,tenderEnd,projName,projDoc).send(tx)
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

  handletoken = e =>{
    console.log(this);
    
    const { token} = this.state
    nervos.appchain
      .getBlockNumber()
      .then(current => {
        const tx = {
          ...transaction,
          from: window.nervos.appchain.defaultAccount,
          validUntilBlock: +current + 88,
        }
        // this.setState({
        //   submitText: submitTexts.submitting,
        // })
        return simpleStoreContract.methods.addToken(token).send(tx)
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
              <li><a href="bidstartportal.html">招标</a></li>
              <li> <a href="bidsubmitportaal.html">投标</a></li>
            </ul>
          </nav>
        </header>


          <h1></h1>
          <div><p align="center"><br/><strong>输入信息以上传标书到链</strong></p></div>
          <table align="center">
              <tr><td><label for="project_name">项目名称：</label></td><td><input type="text" onChange= {this.setprojName} id="project_name"/></td></tr>
              <tr><td>项目保证金数额：</td><td><input type="number" onChange= {this.setprojMargin} id="project_prove_value"/></td></tr>
              <tr><td>项目招标开始时间：</td><td><input type="text" onChange= {this.settenderStart} id="project_start_date"/></td></tr>
              <tr><td>密文提交结束时间：</td><td><input type="text" onChange= {this.settenderConfirm} id="project_start_date"/></td></tr>
              <tr><td>项目招标结束时间：</td><td><input type="text" onChange= {this.settenderEnd} id="project_end_date"/></td></tr>
              <tr><td><p>项目最小投标数：</p></td><td><input type="number" onChange= {this.setcancelNum} id="project_min_submit"/></td></tr>
              <tr><td><p style={{'text-align':'inherit'}}>项目具体描述：</p></td><td><input id="project_definition" onChange={this.setprojDoc}></input></td></tr>
          </table>
          <div class="btn_mid">
            {/* <Link to="/bidstartresult"> */}
              <div class="button" id="submit" onClick={this.handleSubmit}>提交数据</div>
            {/* </Link> */}
          </div>

          <div><p align="center"><br/><strong>增加token</strong></p></div>
          <table align="center">
              <tr><td>token:</td><td><input type="text" onChange= {this.settoken} id="token"/></td></tr>
          </table>
          <div class="btn_mid">
            {/* <Link to="/bidstartresult"> */}
              <div class="button" id="submit" onClick={this.handletoken}>提交数据</div>
            {/* </Link> */}
          </div>


          <h1><div></div></h1>
          
    
        <div class="copyright">&copy;2018 - Team Pyxis</div>
      </div>
    )
  }
}
export default Bidstart
