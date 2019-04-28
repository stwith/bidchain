import React from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import { simpleStoreContract } from '../../simpleStore'
import nervos from '../../nervos'
import transaction from '../../contracts/transaction'



class Bidinvitedetail extends React.Component {
  state = {
    projName:"",
    projMargin:0,
    projDoc:"",
    tenderStart:0,
    tenderConfirm:0,
    tenderEnd:0,
    cancelNum: 0,
    ifStart:"",
    ifEnd:"",
    validCount:0
  }
  constructor(props){
    super(props)

    nervos.appchain
      .getBlockNumber()
      .then(current => {
        const tx = {
          ...transaction,
          validUntilBlock: +current + 88,
        }

        return Promise.all([
simpleStoreContract.methods.margin().call(tx),
simpleStoreContract.methods.projName().call(tx),
simpleStoreContract.methods.cancelNum().call(tx),
simpleStoreContract.methods.projDoc().call(tx),
simpleStoreContract.methods.tenderStart().call(tx),
              simpleStoreContract.methods.tenderConfirm().call(tx),
                simpleStoreContract.methods.tenderEnd().call(tx),
                simpleStoreContract.methods.validCount().call(tx),
                simpleStoreContract.methods.luckyMan().call(tx)
                
        ])

        return {"margin":simpleStoreContract.methods.margin().call(tx),
                "projectName":simpleStoreContract.methods.projName().call(tx),
                "cancelNum":simpleStoreContract.methods.cancelNum().call(tx),
                "projDoc":simpleStoreContract.methods.projDoc().call(tx),
                "tenderStart":simpleStoreContract.methods.tenderStart().call(tx),
                "tenderConfirm":simpleStoreContract.methods.tenderConfirm().call(tx),
                "tenderEnd":simpleStoreContract.methods.tenderEnd().call(tx)
                }
        
        // console.log(Object.getOwnPropertyNames(simpleStoreContract.methods)[2])

        // return simpleStoreContract.methods.margin().call(tx)
      })
      .then(res=>{
        console.log(res)
        const tmp = {
          projName:res[1],
          projMargin:res[0],
          projDoc:res[3],
          tenderStart:res[4],
          tenderConfirm:res[5],
          tenderEnd:res[6],
          cancelNum: res[2],
          ifStart: new Date(parseInt(res[4])+28800000).toISOString(),
          ifEnd: new Date(parseInt(res[6])+28800000).toISOString(),
          validCount: res[7],
          luckyMan: res[8]

        }
        
        
        this.setState(tmp)
        // console.log("state",this.state)
      })
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

        projName = simpleStoreContract.methods().call(tx)

        console.log(projName)

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
        <li> <a href="bidsubmitportal.html">投标</a></li>
      </ul>
    </nav>
  </header>
	
	
	<h1></h1>
	<div align="center"><table align="center" cellpadding="10" border="0">
  <tr>
    <th>类目</th>
    <th>内容</th>
  </tr>
  <tr>
    <td>项目名称</td>
    <td>{this.state.projName}</td>
  </tr>
  <tr>
    <td>项目是否开始招标</td>
    <td>{this.state.ifStart}</td>
  </tr>
  <tr>
    <td>项目是否结束招标</td>
    <td>{this.state.ifEnd}</td>
  </tr>
  <tr>
    <td>项目收到合法投标数目</td>
    <td>{this.state.validCount}</td>
  </tr>
  <tr>
    <td>项目中标者</td>
    <td>{this.state.luckyMan}</td>
  </tr>
</table></div>
<div className="btn_mid">
	<Link to="/">
      <div onclick="location.href='index.html'" class="button">返回</div>
    </Link>
</div>
	<h1></h1>

  <div class="copyright">&copy;2018 - Team Pyxis</div>
</div>
    )
  }
}
export default Bidinvitedetail
