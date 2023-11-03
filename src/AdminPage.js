//Css//
import './Css/App.css';
import './Css/TopBar.css';
import './Css/Body.css';
import './Css/RightBox.css';
import './Css/LeftBox.css';
import './Css/navigationBar.css';
import './Css/loadingBox.css';

//Module react//
import { useState, useEffect } from 'react';
// eslint-disable-next-line
import React from 'react';
//better alert -- SweetAlert//
import swal from 'sweetalert';


//component// //dùng React.lazy giúp chia nhỏ file js sau khi build -> tăng tốc độ load//
const ItemFormDataBaseDiv = React.lazy(() => import('./components/ItemComponents'));
const NothingBox = React.lazy(() => import('./components/NothingComponents'));
const ChartBodyContainer = React.lazy(() => import('./components/ChartComponents'));
const CalenderBox = React.lazy(() => import('./components/CalenderBox'));
const TotalBox = React.lazy(() => import('./components/TotalBox'));
const RemainingBox = React.lazy(() => import('./components/RemainingBox'));
const BodyBox = React.lazy(() => import('./components/BodyBox'));
const NavigationBar = React.lazy(() => import('./components/NavigationBar'));
const LoadingBox = React.lazy(() => import('./components/loadingBox'));

//
const date = new Date();
const jsonDate = JSON.stringify(date);

const year = jsonDate.slice(1, 5);
const month = jsonDate.slice(6, 8); 
const day = jsonDate.slice(9, 11);

function App() {
    //tạo biến useState để lưu thông tin đầu vào//
    const [TradingName, setTradingName] = useState("");
    const [Amount, setAmount] = useState();
    const [Currency, setCurrency] = useState("VND");
    const [DatePurchase, setDatePurchase] = useState(`${year}-${month}-${day}`);
    const [SpendTag, setSpendTag] = useState("");
    //
    const [DataResp, setDataResp] = useState();
    const [Data12Month, setData12Month] = useState([]);
    //
    const [ItemHtml, setItemHtml] = useState([<LoadingBox key={'loadingBox'} />]);
    //
    const [TotalMoneyInMonth, setTotalMoneyInMonth] = useState(0);
    const [TotalMoney, setTotalMoney] = useState(0);
    const [RemainingMoney, setRemainingMoney] = useState(0);
    //
    const [Since, setSince] = useState(`${year}-${month}-01`);
    const [ToDate, setToDate] = useState(`${year}-${month}-${day}`);
    //
    const [NameGiver, setNameGiver] = useState("");
    const [AmountReceive, setAmountReceive] = useState();
    const [DateReceive, setDateReceive] = useState(`${year}-${month}-${day}`);
    //
    const [SearchString, setSearchString] = useState("");
    //
    const [PageTag, setPageTag] = useState('spendPage');


    //full load để lấy tổng tiền đã dùng và số tiền còn lại//
    const fullSpendAndBalanceRequest = async () => {
        let Data = await fetch(
        ' http://localhost:8000/fullSpendAndBalanceRequest', {
            method: "post",
            body: JSON.stringify(
                {
                    title: "fullSpendAndBalanceRequest",
                    date: new Date()
                }
            ),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        Data = await Data.json();
        if(Data) {
            setTotalMoney(Data.FullSpend)
            setRemainingMoney(Data.AccountBalance);            
        }
    }


    //request để load dữ liệu hiển thị//
    const DataBaseLoad = async () => {
        let DataBase = await fetch(
        ' http://localhost:8000/onloadRequest', {
            method: "post",
            body: JSON.stringify(
                {
                    title: "OnloadRequest", 
                    date: new Date(),
                    TimeFilter: {since: Since, toDate: ToDate},
                    ConstTimeFilter: { since: `${year}-${month}-01`, toDate: `${year}-${month}-${day}`}
                }),
            headers: {
                'Content-Type': 'application/json'
            }        
        });
        //đợi server trả về//
        DataBase = await DataBase.json();
        if(DataBase) {
            setItemHtml([<NothingBox key={"nothing"} />]);
            setDataResp(DataBase);
        }
    }
    useEffect(() => {
        DataBaseLoad();
        fullSpendAndBalanceRequest();
        MonthDataInYearRequest();

        //thêm comment dưới đây để tắt thông báo warning//
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const setHtmlItem = async (DataResp, PageTag, Data12Month) => {
        if(DataResp) {
            let Sum = 0;
            if(DataResp.length !== 0) {
                if(PageTag === 'spendPage') {
                    //tạo mảng chứa thẻ item khi Biến DataResp thay đổi//
                    await setItemHtml(DataResp.map((data) => {
                        //tính tổng tiền sữ dụng//
                        Sum += data.Amount;

                        //data truyền vào phải trùng tên với argument của hàm//
                        return <ItemFormDataBaseDiv key={data._id} data={data}/>;
                    }));
                } 
                if(PageTag === 'chartPage') {
                    await setItemHtml([<ChartBodyContainer key={"charBoxSpend"} dataSpend={DataResp} data12Month={Data12Month}/>]);
                }
                setTotalMoneyInMonth(Sum);
            } else {
                console.log('nothing to see here ;)');
                await setItemHtml([<NothingBox key={'nothingBox'} />]);
            };
        }
    }
    //load item để hiển thị - reload hàm khi có sự kiện nhấn chuyển tag Page//
    useEffect(() => {
       setHtmlItem(DataResp, PageTag, Data12Month);
    },[DataResp, PageTag, Data12Month]);

    

    //function chạy khi nhấn submit button//
    const handleOnSubmit = async (event) => {
        event.preventDefault();

        if(!TradingName) {
            swal( "Hmm... Something's not right here", "You need to enter TradingName!", "warning");
            return 0;
        }
        if(!Amount) {
            swal( "Hmm... Something's not right here", "You need to enter Amount!", "warning");
            return 0;
        }
        if(!SpendTag) {
            swal( "Hmm... Something's not right here", "You need to enter SpendTag!", "warning");
            return 0;
        }

        //gửi yêu cầu tạo người dùng đến sẻver//
        let result = await fetch(
        ' http://localhost:8000/SaveSpend', {
            method: "post",
            body: JSON.stringify(
                {
                    SpendTag,
                    TradingName, 
                    Amount, 
                    Currency, 
                    date: DatePurchase, 
                    dateOfEntry: new Date(),
                }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        //đợi server trả về kết quả//
        result = await result.json();
        if (result) {
            setTradingName("");
            setAmount("");
            swal("Save Data", "Done!", "success");
        }
    }


    //
    const SubmitReceive = async (event) => {
        event.preventDefault();

        if(!NameGiver) {
            swal( "Hmm... Something's not right here", "You need to enter NameGiver!", "warning");
            return 0;
        }
        if(!AmountReceive) {
            swal( "Hmm... Something's not right here", "You need to enter Amount!", "warning");
            return 0;
        }

        //gửi đến server//
        let data = await fetch(
        ' http://localhost:8000/SaveReceive', {
            method: "post",
            body: JSON.stringify(
                {
                    title: 'saveReceive',
                    NameGiver,
                    Amount:  AmountReceive,
                    date: DateReceive,
                    DateInput: new Date()
                }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        //nhận từ server//
        data = await data.json()
        if(data) {
            setNameGiver("");
            setAmountReceive("");
        }
    }

    //gửi search request//
    const SearchRequest = async (event) => {
        event.preventDefault();
        if(!SearchString) return 0;

        let result = await fetch(
        ' http://localhost:8000/SearchRequest', {
            method: "post",
            body: JSON.stringify({
                title: "searchRequest",
                SearchString
            }),
            headers: {
                'content-Type': 'application/json'
            }
        });

        result = await result.json();
        if(result) {
            setDataResp(result);
        }
    }


    //lấy dữ liệu của tháng// 
    const MonthDataInYearRequest = async () => {
        let result = await fetch(
            ' http://localhost:8000/MonthDataInYearRequest', {
            method: "post",
            body: JSON.stringify({
                title: "dataInMonthRequest",
                date: new Date()
            }),
            headers: {
                'content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(result) {
            setData12Month(result);
        }
    }

    //đống mở left box//
    const onButtonHideClick = () => {
        const LeftBox = document.querySelector('.LeftBox-div');
        if(LeftBox.id === 'LeftBox-close') {
            LeftBox.id = 'LeftBox-open';
        } else {
            LeftBox.id = 'LeftBox-close';
        }   
        console.log(LeftBox.id);
    }

/////////////////////////////////code html//////////////////////////////////////
    return (
        <>
            <div className='TopBar-box-div'>
                <button className='leftBoxHide-button' onClick={onButtonHideClick}>L</button>
                <h1 className='Text-Admin-h1'>Admin Page</h1>
                
                <div>
                    <select name='tag' className='Select-tag-sel' onChange={(event) => setPageTag(event.target.value)}>
                        <option value={'spendPage'}>Spend Page</option>
                        <option value={'chartPage'}>Chart Page</option>
                    </select>
                </div>

                <div id='container-search-box'>
                    <form action='' className='searchBox-form'>  
                        <input type='search' placeholder='Search something...'className='searchInput-input' value={SearchString} onChange={(event) => setSearchString(event.target.value)}/>
                        <div id='button-search-top-bar'><button value={"Search"} className='button-rainbow' onClick={SearchRequest}></button></div>
                    </form>
                </div>


                <div className='Since-ToDateBox-div'>
                    <p className='SinceText-p'>Since</p>
                    <p className='ToDateText-p'>To Date</p>
                    <input type='date' value={Since} onChange={(event) => setSince(JSON.stringify(event.target.value).slice(1, 11))} className='dateSince-input'/>
                    <input type='date' value={ToDate} onChange={(event) => setToDate(JSON.stringify(event.target.value).slice(1, 11))} className='dateToDate-input'/>
                    <div id='reload-box-btn'><button className='button-rainbow' id='reload' onClick={DataBaseLoad}></button></div>
                </div>

                <div></div>

            </div>

            {/* body */}
            <div id='bodyContainer'>
                <NavigationBar />
                <div className='LeftBox-div' id='LeftBox-close'>
                    <form action=''> 
                        <h2 className='ReceiveText-h2'>Receive</h2>
                        <input type='text' placeholder='Name giver...' value={NameGiver} onChange={(event) => setNameGiver(event.target.value)} className='InputNameGiver-input'/>
                        <input type='number' placeholder='Amount receive...' value={AmountReceive} onChange={(event) => setAmountReceive(event.target.value)} className='InputReceive-input'/>
                        <input type='submit' className='ReceiveSubmit-button' onClick={SubmitReceive} value={"Submit"}/>
                        <input type='date' value={DateReceive} onChange={(event) => setDateReceive(event.target.value)} className='DateReceive-box'></input>
                    </form>
                    <div className='user-box'>
                        <img className='user-img-avatar' src='https://i.pinimg.com/originals/86/dd/bb/86ddbb9654b59b76257867031c864407.jpg' alt='load err'/>
                        <p className='user-name-p'>Nguyễn Hoàng Nam</p>
                    </div>
                </div>

                <BodyBox ItemHtml={ItemHtml}/>

                <div className='Right-Box-div'>
                    <form action='' className='Form-box-form'>
                        <h1 className='add-purchase-text-h1'>Add Purchase to Data Base</h1>
                        <input type='text' placeholder='Trading Name...' value={TradingName} onChange={(event) => setTradingName(event.target.value)} className='trading-name-input'/>
                        <input type='number' placeholder='Amount...' value={Amount} onChange={(event) => setAmount(event.target.value)} className='spend-amount-input'/>
                        <select name='tag-select' className='currency-select'value={Currency} onChange={(event) => setCurrency(event.target.value)}>
                            <option value={'VND'}>VND</option>
                            <option value={'USD'}>USD</option>
                        </select>
                        <input type='date' value={DatePurchase} onChange={(event) => setDatePurchase(event.target.value)} className='spend-date-input'/>
                        
                        <input type='text' placeholder='tag...' className='spend-tag-select' list='spend-tag-list-id' value={SpendTag} onChange={(event) => setSpendTag(event.target.value)}/>
                        <datalist id='spend-tag-list-id'>
                            <option value={'tuition'}>Học phí</option>
                            <option value={'cost-of-living'}>Sinh hoạt phí</option>
                            <option value={'different'}>Khác</option>
                        </datalist>
                        <div id='submit-box-btn'><button className='button-rainbow' id='save' onClick={handleOnSubmit}></button></div>
                    </form>
                    <CalenderBox TotalMoneyInMonth={TotalMoneyInMonth}/>
                    <TotalBox TotalMoney={TotalMoney}/>                
                    <RemainingBox RemainingMoney={RemainingMoney}/>    
                </div>
            </div>
            
        </>
    );
}
export default App;