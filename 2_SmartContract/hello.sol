pragma solidity ^0.4.24;

contract TenderSystem {

    bytes public projDoc;
    uint public cancelNum;

    uint public tenderStart;
    uint public tenderEnd;
    uint public resubStart;

    uint public margin;

    address public chairman;
    address public judgeStandard;
    //address token;
    address public luckyMan;
    address[] private token;
    bytes[] private legalBid;   // struct?
    bytes[][] private bidSha;   // change?
    int luckyFit;

    // struct Files {
    //     bytes plainDoc, 
    //     //uint token,
    //     uint tokenNum,
    //     bytes improveDoc,
    //     bytes[2] fileSha
    // }

    // mapping (address => Files) submittedFiles;

    modifier onlyBefore(uint time)
    {
        require(now < time);
        _;
    }

    modifier onlyAfter(uint time)
    {
        require(now > time);
        _;
    }

    modifier onlyCalledBy(address addr)
    {
        require(msg.sender == addr,"You don't have permission to call this function");
        _;
    }

    event tenderEnded(address, uint fit);
    event tenderCanceled(uint legalbid);

    constructor (
        bytes _projDoc,
        uint _cancelNum,
        uint _tenderStart,
        uint _tenderEnd,
        uint _resubStart,
        uint _margin,
        address _judgeStandard
    ) {
        projDoc = _projDoc;
        cancelNum = _cancelNum;
        tenderStart = _tenderStart;
        tenderEnd = _tenderEnd;
        resubStart = _resubStart;
        margin = _margin;
        judgeStandard = _judgeStandard;

        chairman = msg.sender;

        // token = "0x0000000000000000000000000000000000000000";
    }
    
    function addToken(address bidman) onlyCalledBy(chairman) returns(uint){
        token.push(bidman);
        return token.lenth;
    }
    
    function uploadBlindFile(
        uint tokenNum,
        bytes[2] fileSha
    ) 
    onlyBefore(resubStart) onlyAfter(tenderStart) public payable  {
        msg.sender;
        require(token[tokenNum] == msg.sender, "Your token is invalid");
        //msg.sender;
        require(msg.value == margin,"Not enough or too much value");
        bidSha[tokenNum]=fileSha;
    }

    function uploadRealFile(
        uint tokenNum,
        bytes plainDoc,
        bytes improveDoc
    ) 
    onlyBefore(tenderEnd) onlyAfter(subStart) {
        msg.sender;
        require (token[tokenNum] == msg.sender, "Your token is invalid");
        require(sha3(plainDoc)==bidSha[tokenNum][1],"Wrong plainDoc");
        require(sha3(improveDoc)==bidSha[tokenNum][2],"Wrong improveDoc");
        // calc
        // replace with a struct
        // legalBid.push({msg.sender,plainDoc,improveDoc});
        legalBid.push(msg.sender);
    }

    function cancelTender()
    private payable {
        if(legalBid.lenth < cancelNum){
            luckyMan = 0;
        }
    }

    function returnMoney()
    private payable {
        // bidSha? return.
        if (luckyMan == 0)
        {
            emit tenderFinished(luckyMan, luckyFit);
        }
        else
        {
            emit tenderCanceled(legalBid);
        }
    }

    function finishTender()
    onlyCalledBy(chairman) public payable {
        cancelTender();
        returnMoney();
    }

 /*    function resubFile(
        bytes plainDoc,
        bytes plainAdditionalDocs
    ) public {

    }*/


}
