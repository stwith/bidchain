import React from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import { simpleStoreContract } from '../../simpleStore'
import nervos from '../../nervos'
import transaction from '../../contracts/transaction'




class Bidsubmit extends React.Component {
  
  state = {
    tokenNum:0,
    mainDoc:"",
    productName:"",
    parameters:[0,0,0,0,0], //尺寸，分辨率，刷新率，亮度，单价
    size:0,
    resolution:100,
    refreshrate:60,
    brightness:0,
    unitprice:0
  }


  setmainDoc = e => {
    this.setState({mainDoc:e.target.value})
    console.log(e.target.value)
  }
  setproductName = e => {
    this.setState({productName:e.target.value})
    console.log(e.target.value)
  }
  setsize = e => {
    this.setState({size:parseInt(e.target.value)})
    console.log(e.target.value)
  }
  setresolution = e => {
    this.setState({resolution:parseInt(e.target.value)})
    console.log(e.target.value)
  }
  setrefreshrate = e => {
    this.setState({refreshrate:parseInt(e.target.value)})
    console.log(e.target.value)
  }
  setbrightness = e => {
    this.setState({brightness:parseInt(e.target.value)})
    console.log(e.target.value)
  }
  setunitprice = e => {
    this.setState({unitprice:parseInt(e.target.value)})
    console.log(e.target.value)
  }


  pay = e => {
    console.log(this);
    
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
        return simpleStoreContract.methods.uploadBlind(0,"0x00","0x00").send(tx)
      })
      .then(res => {
        if (res.hash) {
          console.log(res)
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

  handleSubmitBlind = e => {
    console.log(this);
    this.state.parameters = [this.state.size,this.state.resolution,this.state.refreshrate,this.state.brightness,this.state.unitprice]
    const { tokenNum,mainDoc,productName,parameters } = this.state
    console.log(this.state)
    nervos.appchain
      .getBlockNumber()
      .then(current => {
        console.log(23333)
        const tx = {
          ...transaction,
          from: window.nervos.appchain.defaultAccount,
          validUntilBlock: +current + 88,
        }
        // this.setState({
        //   submitText: submitTexts.submitting,
        // })
        
        return simpleStoreContract.methods.uploadBlind(tokenNum, "0x00", "0x00").send(tx)
      })
      .then(res => {
        if (res.hash) {
          console.log(res)
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

  handleSubmitReal = e =>{
    console.log(this);
    this.state.parameters = [this.state.size,this.state.resolution,this.state.refreshrate,this.state.brightness,this.state.unitprice]
    const { tokenNum,mainDoc,productName,parameters } = this.state
    console.log(this.state)
    nervos.appchain
      .getBlockNumber()
      .then(current => {
        console.log(23333)
        const tx = {
          ...transaction,
          from: window.nervos.appchain.defaultAccount,
          validUntilBlock: +current + 88,
        }
        // this.setState({
        //   submitText: submitTexts.submitting,
        // })
        
        return simpleStoreContract.methods.uploadReal(tokenNum, mainDoc, productName, parameters).send(tx)
      })
      .then(res => {
        if (res.hash) {
          console.log(res)
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
    <div><p align="center"><br/><strong>输入信息在链上投标</strong>{/*<div onClick={this.pay} class="button" id="submit">支付保证金</div>*/}</p></div>
	<table align="center">
		<tbody>
    <tr><td><label for="project_name"><p>竞标产品名称：</p></label></td><td><input type="text" onChange={this.setproductName} id="product_name"/></td></tr>
		<tr><td><label for="project_name"><p>产品文档</p></label></td><td><input type="text" onChange={this.setmainDoc} id="product_name"/><a href="http://ipfs.lycoris.work/" target="_blank" class="button" id="submit">上交文件</a></td></tr>
		
    {/* <tr><td><p>含有保证金的钱包地址：</p></td><td><input type="text" id="project_prove_address"/></td></tr> */}

	</tbody></table>
	<hr/>
	<p style={{'text-align': 'center'}}><strong>以下为甲方要求提供内容</strong></p>
	<table align="center">
	  <tbody><tr><td><p>屏幕分辨率：</p></td> <td><select id="resolution" onChange={this.setresolution}><option value="100">FHD (1080P)</option><option value="200">2K (1440P)</option><option value="250">4K-UHD (2160P)</option></select></td></tr>
	  <tr><td><p>屏幕尺寸：</p></td><td><input type="number" min="23" onChange={this.setsize} id="project_min_submit"/></td></tr>
	 
		<tr><td><p>定价：</p></td><td><input type="number" min="" max="3500" onChange={this.setunitprice} id="price"/></td></tr>
    <tr><td><p>刷新率：</p></td><td><select type="number" id="refresh_rate" onChange={this.setrefreshrate}><option value="60">60Hz</option><option value="75">75Hz</option><option value="90">90Hz</option><option value="120">120Hz</option></select></td></tr>
    <tr><td><p>亮度：</p></td><td><input type="number" id="refresh_rate" onChange={this.setbrightness}/></td></tr>
		<tr><td><p>面板类型：</p></td><td><select disabled="" ><option>IPS</option><option>VA</option></select></td></tr>
		<tr><td><p>长宽比：</p></td><td><select disabled=""><option>16:9</option><option>16:10</option><option>21:9</option></select></td></tr>
  </tbody></table>
  <div class="btn_mid">
    <div onClick={this.handleSubmitBlind} class="button" id="submit">提交密文</div>
    <div onClick={this.handleSubmitReal} class="button" id="submit">提交明文</div>
  </div>
	
  <h1><div></div></h1>



        <div class="copyright">&copy;2018 - Team Pyxis</div>
      </div>
    )
  }
}
export default Bidsubmit
