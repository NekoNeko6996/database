//Css//
import './Css/App.css';
import './Css/TopBar.css';
import './Css/Body.css';
import './Css/RightBox.css';
import './Css/LeftBox.css';
import './Css/navigationBar.css';

//Modun//
import { useState, useEffect, React } from 'react';

//
const date = new Date();
const jsonDate = JSON.stringify(date);

const year = jsonDate.slice(1, 5);
const month = jsonDate.slice(6, 8); 
const day = jsonDate.slice(9, 11);


function ItemFormDataBaseDiv({ data }) {
    
    //toLocaleString("vi-VN") để định dạng 100000 thành 100.000//

    return (
        <div className='itemFormDataBaseDiv'>
            <p className='idBox'>ID: {data._id}</p>

            <p className='tradingNameText'>Trading Name</p>
            <p className='tradingNameBox'>{data.TradingName}</p>

            <p className='amountText'>Amount</p>    
            <p className='amountBox'>{data.Amount.toLocaleString("vi-VN")} {data.Currency}</p>

            <p className='datePurchaseText'>Date Purchase</p>
            <p className='datePurchaseBox'>{data.date}</p>

            <p className='dateInputText'>Date input</p>
            <p className='dateInputBox'>{data.dateOfEntry}</p>
        </div>
    )
};

function NothingBox() {
    return (
        <div className='NothingBox-div'>
            <img width="48" height="48" src="https://img.icons8.com/pulsar-color/48/nothing-found.png" alt="nothing-found" id='nothing-icon'/>
            <p className='nothingText-p'>Hmm... Nothing To See Here</p>
        </div>
    )
}



//cột dọc//
function ChartBoxVerticalColumn(props) {
    let MaxValue = 0;
    let indexValue = 0;

    //tìm phần tử có amount lớn nhất//
    props.dataResp.map((data, index) => {
        if(data.Amount > MaxValue) MaxValue = data.Amount;
        indexValue = index;
        return 0;
    })

    const StyleChartBoxDiv = {
        gridTemplateColumns: `repeat(${indexValue + 1}, 30px)`,
    }

    const html_char = props.dataResp.reverse().map((data, index) => {
        return <div className='ColumnContainer-vertical-div'>
            <div className='columnChartBox-vertical' key={`${data._id}${index}`} style={
                {
                    width: "90%",
                    height: `${(data.Amount/MaxValue)*70}%`,
                }}> <div className='TextContentChart-vertical-div'><p className='TextContentChart-p-vertical'>{data.Amount.toLocaleString("vi-VN")}</p></div>
            </div>
            <p className='date-char-vertical-p'>{data.month}-{data.year}</p>
        </div>
    })
    //.reverse để đảo ngược thứ tự của element trong mảng item//
    return (
        <div className='chartBox-vertical-div' style={StyleChartBoxDiv}>
            {html_char}
        </div>
    )
}


//cột ngang//
//để nhận nhiều tham số thì dùng props//
function ChartBoxHorizontalColumn(props) {
    let MaxValue = 0;
    let indexValue = 0;

    //tìm phần tử có amount lớn nhất//
    props.dataResp.map((data, index) => {
        if(data.Amount > MaxValue) MaxValue = data.Amount;
        indexValue = index;
        return 0;
    })

    const StyleChartBoxDiv = {
        gridTemplateRows: `repeat(${indexValue + 1}, 30px)`,
    } 

    const html_char = props.dataResp.map((data, index) => {
        return <div className='ColumnContainer-div'>
            <div className='columnChartBox' key={`${data._id}${index}`} style={
                {
                    height: "90%",
                    width: `${(data.Amount/MaxValue)*60}%`,
                }}> <div className='TextContentChart-div'><p className='TextContentChart-p'>{data.Amount.toLocaleString("vi-VN")}</p></div>
            </div>
            <p className='date-char-v-p'>{data.date}</p>
        </div>
    })

    return (
        <div className='chartBox-div' style={StyleChartBoxDiv}>
            {html_char}
        </div>
    )
}


function ChartBodyContainer(props) {
    return (
        <div>
            <ChartBoxHorizontalColumn dataResp={props.dataSpend}/>
            <ChartBoxVerticalColumn dataResp={props.data12Month} />
        </div>
    )
}





function App() {
    //tạo biến useState để lưu thông tin đầu vào//
    const [TradingName, setTradingName] = useState("");
    const [Amount, setAmount] = useState();
    const [Currency, setCurrency] = useState("");
    const [DatePurchase, setDatePurchase] = useState("");
    //
    const [DataResp, setDataResp] = useState();
    const [Data12Month, setData12Month] = useState([]);
    //
    const [ItemHtml, setItemHtml] = useState([]);
    //
    const [TotalMoneyInMonth, setTotalMoneyInMonth] = useState(0);
    const [TotalMoney, setTotalMoney] = useState(0);
    const [RemainingMoney, setRemainingMoney] = useState(0);
    //
    const [Since, setSince] = useState(`${year}-${month}-01`);
    const [ToDate, setToDate] = useState(`${year}-${month}-${day}`);
    //
    const [NameGiver, setNameGiver] = useState("");
    const [AmountReceive, setAmountReceive] = useState("");
    const [DateReceive, setDateReceive] = useState("");
    //
    const [SearchString, setSearchString] = useState("");
    //
    const [PageTag, setPageTag] = useState('spendPage');


    //full load để lấy tổng tiền đã dùng và số tiền còn lại//
    const fullSpendAndBalanceRequest = async () => {
        let Data = await fetch(
        'http://localhost:8000/fullSpendAndBalanceRequest', {
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
        })

        Data = await Data.json();
        if(Data) {
            setTotalMoney(Data.FullSpend)
            setRemainingMoney(Data.AccountBalance);
            console.log(Data);
            
        }
    }


    //request để load dữ liệu hiển thị//
    const DataBaseLoad = async () => {
        let DataBase = await fetch(
        'http://localhost:8000/onloadRequest', {
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
        })
        //đợi server trả về//
        DataBase = await DataBase.json();
        if(DataBase) {
            setItemHtml([<NothingBox key={"nothing"} />]);
            setDataResp(DataBase);
        }
    }
    //sữ dụng useEffect() để gọi khi load component lần đầu tiên//
    //khắc phụ lỗi request 2 lần//
    useEffect(() => {
        DataBaseLoad();
        fullSpendAndBalanceRequest();
        MonthDataInYearRequest();

        //thêm comment dưới đây để tắt thông báo warning//
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const setHtmlItem = async (DataResp) => {
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
       setHtmlItem(DataResp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[DataResp, PageTag, Data12Month]);

    



    //function chạy khi nhấn submit button//
    const handleOnSubmit = async (event) => {
        event.preventDefault();

        //gửi yêu cầu tạo người dùng đến sẻver//
        let result = await fetch(
        'http://localhost:8000/SaveSpend', {
            method: "post",
            body: JSON.stringify(
                {
                    title: 'SaveSpend',
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
        }
    }


    //
    const SubmitReceive = async (event) => {
        event.preventDefault();
        //gửi đến server//
        let data = await fetch(
        'http://localhost:8000/SaveReceive', {
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
        })

        //nhận từ server//
        data = await data.json()
        if(data) {
            console.log(data);
            setNameGiver("");
            setAmountReceive("");
            setDateReceive("");
        }
    }

    //gửi search request//
    const SearchRequest = async (event) => {
        event.preventDefault();
        let result = await fetch(
        'http://localhost:8000/SearchRequest', {
            method: "post",
            body: JSON.stringify({
                title: "searchRequest",
                SearchString
            }),
            headers: {
                'content-Type': 'application/json'
            }
        })

        result = await result.json();
        if(result) {
            setDataResp(result);
        }
    }


    //lấy dữ liệu của tháng//
    const MonthDataInYearRequest = async () => {
        let result = await fetch(
            'http://localhost:8000/MonthDataInYearRequest', {
            method: "post",
            body: JSON.stringify({
                title: "dataInMonthRequest",
                date: new Date()
            }),
            headers: {
                'content-Type': 'application/json'
            }
        })
        result = await result.json();
        if(result) {
            console.log(result);
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

                <div>
                    <form action='' className='searchBox-form'>  
                        <input type='text' placeholder='Search something...'className='searchInput-input' value={SearchString} onChange={(event) => setSearchString(event.target.value)}/>
                        <input type='submit' value={"Search"} className='searchSubmit-inputBtn' onClick={SearchRequest}/>
                    </form>
                </div>

                <div className='Since-ToDateBox-div'>
                    <p className='SinceText-p'>Since</p>
                    <input type='date' value={Since} onChange={(event) => setSince(JSON.stringify(event.target.value).slice(1, 11))} className='dateSince-input'/>
                    <p className='ToDateText-p'>To Date</p>
                    <input type='date' value={ToDate} onChange={(event) => setToDate(JSON.stringify(event.target.value).slice(1, 11))} className='dateToDate-input'/>
                </div>

                <div></div>
                <button className='Reload-button' id='reload' onClick={DataBaseLoad}>Reload Data</button>
            </div>

            <div className='left-navigation-bar-div'>
                <a href='https://mail.google.com/mail/' target='_blank' rel="noreferrer">
                    <img className='Mail-icon-img' src='https://www.thewindowsclub.com/wp-content/uploads/2020/10/Gmail-Logo.png' alt='loadErr'/>
                </a>
            </div>

            <div className='LeftBox-div' id='LeftBox-close'>
                <form action=''> 
                    <h2 className='ReceiveText-h2'>Receive</h2>
                    <input type='text' placeholder='Name giver...' value={NameGiver} onChange={(event) => setNameGiver(event.target.value)} className='InputNameGiver-input'/>
                    <input type='text' placeholder='Amount receive...' value={AmountReceive} onChange={(event) => setAmountReceive(event.target.value)} className='InputReceive-input'/>
                    <input type='submit' className='ReceiveSubmit-button' onClick={SubmitReceive} value={"Submit"}/>
                    <input type='date' value={DateReceive} onChange={(event) => setDateReceive(event.target.value)} className='DateReceive-box'></input>
                </form>
            </div>

            <div className='body-box-div'>
                {ItemHtml}
            </div>

            <div className='Right-Box-div'>
                <form action='' className='Form-box-form'>
                    <h1>Add Purchase to Data Base</h1>
                    <input type='text' placeholder='Trading Name...' value={TradingName} onChange={(event) => setTradingName(event.target.value)}/>
                    <input type='text' placeholder='Amount...' value={Amount} onChange={(event) => setAmount(event.target.value)}/>
                    <input type='type' placeholder='Currency...' value={Currency} onChange={(event) => setCurrency(event.target.value)}/>
                    <input type='date' value={DatePurchase} onChange={(event) => setDatePurchase(event.target.value)}/>
                    <input type='submit' className='Submit-button' id='save' onClick={handleOnSubmit} value={"Submit"}/> 
                </form>

                <div className='CalcInformation-div'>
                    <h3 className='informationText-h3'>CALENDER</h3>
                    <iframe title='Calender' src="https://calendar.google.com/calendar/embed?src=lqm231231%40gmail.com&ctz=Asia%2FHo_Chi_Minh"></iframe>



                    <h2 className='TotalInMonthBox-h2'>Total in Month: {TotalMoneyInMonth.toLocaleString("vi-VN")} VND</h2>    
                </div>

                <div className='TotalBox-div'>
                    <h2 className='Total-h2'>Total: {TotalMoney.toLocaleString("vi-VN")} VND</h2>
                </div>

                <div className='RemainingBox-div'>
                    <h2 className='Remaining-h2'>Remaining: {RemainingMoney.toLocaleString("vi-VN")} VND</h2>
                </div>
            </div>
        </>
    );
}

export default App;