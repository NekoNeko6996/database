import React from "react";

//box hiện item//
function ItemFormDataBaseDiv({ data }) {
    console.log('render: item');
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
export default React.memo(ItemFormDataBaseDiv);