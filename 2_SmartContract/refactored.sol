pragma solidity ^0.4.24;

/** @title 招标系统.
 *  一套基于区块链的多模式招标系统
 */
contract TenderSystem {

    /// 最小投标数 / 流标值
    uint public cancelNum;
    /// 项目保证金
    uint public margin;
    /// 项目文档的 IPFS ID
    string public projDoc;
    /// 项目名称
    string public projectName;

    /// 招标开始时间 / 密文提交开始时间
    uint public tenderStart;
    /// 密文提交结束时间 / 明文提交开始时间
    uint public tenderComfirm;
    /// 明文提交结束时间 / 招标结束时间
    uint public tenderEnd;

    /// 主办方
    address public chairMan;

    /// 有效投标数
    uint public vaildCount;

    /// 常量: 默认量化值
    int constant DEFAULT_BIDPARAM = -0xffffff;
    /// 常量: 不正确的投标
    int constant INVAILD_BIDPARAM = 0xfffffff;
    /// 常量: 投标被取消
    uint constant BID_CANCELED = 0xfffffff;

    /// 中标者
    uint public luckyMan = BID_CANCELED;
    /// 最优值
    int public luckyNumber = DEFAULT_BIDPARAM;

    
    /**
      * 公开的招标信息
      */
    struct bidinfoPublic
    {
        /// 用户的钱包地址
        address addr;

        /// 文档 IPFS ID 的 SHA 值
        bytes32 mainDocSHA;
        /// 参数数组的 SHA 值
        bytes32 parametersSHA;
    }

    /**
      * 非公开的招标信息
      *
      * TODO: 在招标结束时公开
      */
    struct bidinfoPrivate
    {
        /// 用户是否加入了投标
        bool isJoined;
        /// 用户投标是否能经过验证
        bool isFake;

        /// 产品名称
        string productName;
        
        /// 文档的 IPFS ID
        string mainDoc;

        /// 参数数组
        int[] parameters;
    }

    /// 公开招标信息数组
    bidinfoPublic[] public bidInfoPublic;
    /// 非公开招标信息数组
    bidinfoPrivate[] public bidInfoPrivateEnd;
    bidinfoPrivate[] private bidInfoPrivate;
    /**
      * 函数必须在该时间前执行
      *
      * @param time 时间 
      */
    modifier onlyBefore(uint time)
    {
        // require(now < time);
        _;
    }

    /**
      * 函数必须在该时间后执行
      *
      * @param time 时间 
      */
    modifier onlyAfter(uint time)
    {
        // require(now > time);
        _;
    }

    /**
      * 函数必须由该地址执行
      *
      * @param addr 所限制的地址 
      */
    modifier onlyCalledBy(address addr)
    {
        // require(msg.sender == addr, "you don't have permission to call this function");
        _;
    }

    /**
      * 函数的 token number 必须对应调用者钱包地址
      *
      * @param tokenNum 函数的执行者所给的 token 编号 
      */
    modifier sameToken(uint tokenNum)
    {
        // require(bidInfoPublic[tokenNum].addr == msg.sender, "the token number you provided is invalid");
        _;
    }

    /**
      * 合约必须已经被初始化
      */
    modifier onlyAfterInit
    {
        // require(tenderEnd != 0, "the contract hasn't been initialized, please contact chairman for more information.");
        _;
    }
    
    /**
      * 明文提交开始
      */
    event comfirmStarted();

    /**
      * 招标结束 
      *
      * @param addr 中标者地址
      */
    event tenderEnded(address addr);
    
    /**
      * 流标 
      *
      * @param legalbid 有效投标数
      */
    event tenderCanceled(uint legalbid);

    /**
      * 构造函数
      *
      * 主办方为合约创造者
      */
    constructor ()
    public
    {
        chairMan = msg.sender;
    }

    /**
      * @dev 上传标准文档
      *
      * @param _cancelNum 最小投标数 / 流标值
      * @param _margin 项目保证金
      * @param _projDoc 项目文档 
      * @param _tenderStart 招标开始时间 / 密文提交开始时间
      * @param _tenderComfirm 密文提交结束时间 / 明文提交开始时间
      * @param _tenderEnd 明文提交结束时间 / 招标结束时间
      * @param _projectName 项目名称
      *
      * 只能在被初始化后执行
      * 只能由主办方执行
      * 只能在招标开始之前执行
      * 外部函数
      * TODO 若未执行此函数禁止之后函数执行并直接还钱结束
      */
    function uploadStandard
    (
        uint _cancelNum,
        uint _margin,
        string _projDoc,
        uint _tenderStart,
        uint _tenderComfirm,
        uint _tenderEnd,
        string _projectName
    )
    onlyCalledBy(chairMan)
    external
    returns(uint)
    {
        cancelNum = _cancelNum;
        margin = _margin;
        projDoc = _projDoc;
        tenderStart = _tenderStart;
        tenderComfirm = _tenderComfirm;
        tenderEnd = _tenderEnd;
        projectName = _projectName;

        // require(tenderStart < tenderComfirm, "tender start time should be earlier than tender comfirm time");
        // require(now < tenderStart, "tender start time should be later than now");
        // require(tenderComfirm < tenderEnd, "tender comfirm time should be earlier than tender end time");

        return tenderStart;
    }
    
    /**
      * @dev 添加 token
      * 
      * @param _token 要添加的 token
      *
      * 只能在被初始化后执行
      * 只能由主办方执行
      * 只能在招标开始之前执行
      * 外部函数
      *
      * @return 分配到的 token number
      */
    function addToken(address _token)
    onlyAfterInit
    onlyCalledBy(chairMan)
    onlyBefore(tenderStart)
    external
    returns (uint)
    {
        bidInfoPrivate.push(bidinfoPrivate({
            productName: "",
            isJoined: false,
            isFake: true,
            mainDoc: "",
            parameters: new int[](0)
        }));
        return bidInfoPublic.push(bidinfoPublic({
            addr: _token,
            mainDocSHA: 0,
            parametersSHA: 0})) - 1;
    }

    /**
      * @dev 添加密文
      *
      * @param tokenNum token number
      * @param mainDocSHA 文档 IPFS ID 的 SHA 值
      * @param parametersSHA 参数数组的 SHA 值
      * 
      * 只能在被初始化后执行
      * 必须保证 token number 对应函数执行者
      * 只能在招标开始之后执行
      * 只能在招标确认之前执行
      * 外部函数
      *
      * @return 分配到的 token number
      */
    function uploadBlind
    (
        uint tokenNum, 
        bytes32 mainDocSHA,
        bytes32 parametersSHA
    )
    onlyAfterInit
    onlyAfter(tenderStart)
    onlyBefore(tenderComfirm)
    sameToken(tokenNum)
    external
    payable
    {
        // require(msg.value == margin, "you provided not enough or too much value");

        bidInfoPublic[tokenNum].mainDocSHA = mainDocSHA;
        bidInfoPublic[tokenNum].parametersSHA = parametersSHA;
        bidInfoPrivate[tokenNum].isJoined = true;
    }

    /**
      * @dev 添加明文
      *
      * @param tokenNum token number
      * @param mainDoc 文档 IPFS ID
      * @param productName 产品名称
      * @param parameters 参数数组
      * 
      * 只能在被初始化后执行
      * 必须保证 token number 对应函数执行者
      * 只能在招标确认之后执行
      * 只能在招标结束之前执行
      * 外部函数
      *
      * @return 分配到的 token number
      *
      */
    function uploadReal
    (
        uint tokenNum,
        string mainDoc,
        string productName,
        int[] parameters
    )
    onlyAfterInit
    sameToken(tokenNum)
    onlyAfter(tenderComfirm)
    onlyBefore(tenderEnd)
    external
    {
        // require(bidInfoPublic[tokenNum].mainDocSHA == sha256(abi.encodePacked(mainDoc)), "the main document you provided is invalid");
        
        // require(bidInfoPublic[tokenNum].parametersSHA == sha256(abi.encodePacked(parameters)), "the paramerers you provided is invalid");

        bidInfoPrivate[tokenNum].mainDoc = mainDoc;
        bidInfoPrivate[tokenNum].productName = productName;
        bidInfoPrivate[tokenNum].parameters = parameters;

        int res = judgeBid(parameters);
        if (res != INVAILD_BIDPARAM)
        {
            bidInfoPrivate[tokenNum].isFake = false;
            vaildCount++;

            if (res > luckyNumber || luckyNumber == INVAILD_BIDPARAM)
            {
                luckyNumber = res;
                luckyMan = tokenNum;
            }
        }
    }

    /**
      * @dev 评测投标
      *
      * @param parameters 参数数组
      * 
      * 只能在被初始化后执行
      * 只能在招标确认之后执行
      * 只能在招标结束之前执行
      * 内部函数
      * 浏览
      *
      * @return 返回的量化值
      * 如果不符合要求则会返回 INVAILD_BIDPARAM
      *
      * TODO: 返回报错给出具体的错误参数
      *
      */
    function judgeBid(int[] parameters)
    onlyAfterInit
    onlyAfter(tenderComfirm)
    onlyBefore(tenderEnd)
    internal
    view
    returns(int ret)
    {
        // require(parameters.length >= 5, "parameters length too short");
        int size = parameters[0];
        int resolution = parameters[1];
        int refreshrate = parameters[2];
        int brightness = parameters[3];
        int unitprice = parameters[4];
        if (size < 23 || brightness <= 200 || unitprice >= 3500)
        {
            return INVAILD_BIDPARAM;
        }
        else
        {
            int score = ((size * 10 + resolution + refreshrate) * 20000 + brightness * 4000) / unitprice;
            return score;
        }
    }

    /**
      * @dev 完成投标
      *
      * 只能在被初始化后执行
      * 只能在招标结束之后执行
      * 只能由主办方执行
      * 公开函数
      * 可支付
      *
      * 比较 有效投标数 与 流标值
      * 如果前者小于等于后者则流标
      * 之后还钱，中间跳过中标者
      *
      * TODO: 公开招标信息
      */
    function finishTender()
    onlyAfterInit
    onlyAfter(tenderEnd)
    onlyCalledBy(chairMan)
    public
    payable 
    {
        if (vaildCount <= cancelNum)
        {
            cancelTender();
        }
        for (uint i = 0; i < bidInfoPrivate.length; i++)
        {
            if (i == luckyMan)
            {
                chairMan.transfer(margin);
                emit tenderEnded(bidInfoPublic[luckyMan].addr);
                continue;
            }
            if (bidInfoPrivate[i].isJoined)
            {
                bidInfoPublic[i].addr.transfer(margin);
            }
        }
        bidInfoPrivateEnd = bidInfoPrivate;
    }

    /**
      * @dev 流标
      * 
      * 只能在招标开始之后执行
      * 私密
      *
      * TODO: 起始人数不足时直接流标
      */
    function cancelTender()
    onlyAfter(tenderStart)
    private
    {
        luckyMan = BID_CANCELED;
        emit tenderCanceled(vaildCount);
    }
}
