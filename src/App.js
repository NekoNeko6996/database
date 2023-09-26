//Css//
import './Css/App.css';
import './Css/TopBar.css';
import './Css/Body.css';
import './Css/RightBox.css';
import './Css/LeftBox.css';

//Modun//
import { useState } from 'react'
import { useEffect } from 'react';

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




function App() {
    //tạo biến useState để lưu thông tin đầu vào//
    const [TradingName, setTradingName] = useState("");
    const [Amount, setAmount] = useState();
    const [Currency, setCurrency] = useState("");
    const [DatePurchase, setDatePurchase] = useState("");
    //
    const [DataResp, setDataResp] = useState();
    const [FullLoadSpendDataResp, setFullLoadSpendDataResp] = useState();
    const [FullLoadReceiveDataResp, setFullLoadReceiveDataResp] = useState();
    const [SpendDataSinceResp, setSpendDataSinceResp] = useState();
    //
    const [ItemHtml, setItemHtml] = useState("");
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


    ////
    const fullDataBaseLoadRequest = async () => {
        let Data = await fetch(
        'http://localhost:3001/fullDataBaseSpentLoadRequest', {
            method: "post",
            body: JSON.stringify(
                {
                    content: "fullDataBaseSpendLoadRequest",
                    date: new Date()
                }
            ),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        Data = await Data.json();
        if(Data) {
            setFullLoadSpendDataResp(Data.FullSpend);
            setFullLoadReceiveDataResp(Data.FullReceive);
            setSpendDataSinceResp(Data.SpendSince);
            console.log(Data);
        }
    }
    //
    useEffect(() => {
        if(FullLoadSpendDataResp) {
            let SumFullLoad = 0;
            FullLoadSpendDataResp.map((data) => {
                SumFullLoad += data.Amount;
                return 0;
            });
            setTotalMoney(SumFullLoad);
        }
    }, [FullLoadSpendDataResp]);
    //tính toán số dư còn lại//
    useEffect(() => {
        let SumFullReceive = 0;
        let SumSpendSince = 0;
        if(FullLoadReceiveDataResp) {

            FullLoadReceiveDataResp.map((data) => {
                SumFullReceive += data.Amount;
                return 0;
            });
        }
        if(SpendDataSinceResp) {
            SpendDataSinceResp.map((data) => {
                SumSpendSince += data.Amount;
                return 0;
            });
        }
        setRemainingMoney(SumFullReceive - SumSpendSince);
    }, [FullLoadReceiveDataResp, SpendDataSinceResp])



    //request để load dữ liệu hiển thị//
    const DataBaseLoad = async () => {
        let DataBase = await fetch(
        'http://localhost:3001/onloadRequest', {
            method: "post",
            body: JSON.stringify(
                {
                    content: "loadRequest", 
                    date: new Date(),
                    TimeFilter: {since: Since, toDate: ToDate}
                }),
            headers: {
                'Content-Type': 'application/json'
            }        
        })

        //đợi server trả về//
        DataBase = await DataBase.json();
        if(DataBase) {
            console.log(DataBase);
            setDataResp(DataBase);
        }
    }
    //sữ dụng useEffect() để gọi khi load component lần đầu tiên//
    //khắc phụ lỗi request 2 lần//
    useEffect(() => {
        DataBaseLoad();
        fullDataBaseLoadRequest();

        //thêm comment dưới đây để tắt thông báo warning//
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    //load item để hiển thị//
    useEffect(() => {
        if(DataResp) {
            let Sum = 0;
            //tạo mảng chứa thẻ item khi Biến DataResp thay đổi//
            setItemHtml(DataResp.map((data) => {
                //tính tổng tiền sữ dụng//
                Sum += data.Amount;
                //data truyền vào phải trùng tên với argument của hàm//
                return <ItemFormDataBaseDiv key={data._id} data={data}/>
            }));
            setTotalMoneyInMonth(Sum);
        }
    },[DataResp]);


    //function chạy khi nhấn submit button//
    const handleOnSubmit = async (e) => {
        e.preventDefault();

        //gửi yêu cầu tạo người dùng đến sẻver//
        let result = await fetch(
        'http://localhost:3001/SaveSpend', {
            method: "post",
            body: JSON.stringify(
                {
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
            setCurrency("");
            setDatePurchase("");
        }
    }


    //
    const SubmitReceive = async () => {
        //gửi đến server//
        let data = await fetch(
        'http://localhost:3001/SaveReceive', {
            method: "post",
            body: JSON.stringify(
                {
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
                <div></div>

                <div className='Since-ToDateBox-div'>
                    <p className='SinceText-p'>Since</p>
                    <input type='date' value={Since} onChange={(event) => setSince(JSON.stringify(event.target.value).slice(1, 11))} className='dateSince-input'/>
                    <p className='ToDateText-p'>To Date</p>
                    <input type='date' value={ToDate} onChange={(event) => setToDate(JSON.stringify(event.target.value).slice(1, 11))} className='dateToDate-input'/>
                </div>

                <div></div>
                <button className='Reload-button' id='reload' onClick={DataBaseLoad}>Reload Data</button>
            </div>

            <div className='LeftBox-div' id='LeftBox-close'>
                <h2 className='ReceiveText-h2'>Receive</h2>
                <input type='text' placeholder='Name giver...' value={NameGiver} onChange={(event) => setNameGiver(event.target.value)} className='InputNameGiver-input'/>
                <input type='text' placeholder='Amount receive...' value={AmountReceive} onChange={(event) => setAmountReceive(event.target.value)} className='InputReceive-input'/>
                <button className='ReceiveSubmit-button' onClick={SubmitReceive}>Submit</button>
                <input type='date' value={DateReceive} onChange={(event) => setDateReceive(event.target.value)} className='DateReceive-box'></input>
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
                    <button className='Submit-button' id='save' onClick={handleOnSubmit}>Submit</button> 
                </form>

                <div className='CalcInformation-div'>
                    <h3 className='informationText-h3'>INFORMATION</h3>
                    <p className='TimeBox-p'>Time: {date.getUTCMonth() + 1}/{date.getUTCFullYear()}</p>



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