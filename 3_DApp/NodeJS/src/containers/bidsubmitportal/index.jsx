import React from 'react'
import logo from '../../public/images/logo.svg'
import BottomNav from '../../components/BottomNav'

import { Link } from 'react-router-dom'

const Bidsubmitportal = () => (

<div className="container"> 

  <header> <a href="index.html">
    <h4 className="logo"><img width="120" src="img/logo.png"  alt="BidChain System" /></h4>
    </a>
    <nav>
      <ul>
        <li><a href="/">首页</a></li>
        <li><a href="/bidstartportal">招标</a></li>
        <li> <a href="/bidsubmitportal">投标</a></li>
      </ul>
    </nav>
  </header>


<section className="hero" id="hero">
    <h2 className="hero_header">无 竞</h2>
    <p className="tagline">A NEXT-GEN BIDDING SYSTEM BASED ON BLOCKCHAIN</p>
    <div class="btn_mid">
        <Link to="/bidsubmit">
        <div className="button" id="start">发起投标</div>
        </Link>
    </div>
    <div class="btn_mid">
        <Link to="/bidsubmitenquiry">
        <div className="button" id="submit">查询投标状况</div>
        </Link>
    </div>
  </section>


  <div className="copyright">&copy;2018 - Team Pyxis</div>
</div>

  
)

export default Bidsubmitportal
