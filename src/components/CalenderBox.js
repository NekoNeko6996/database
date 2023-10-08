//
import React from "react";

//
function CalenderBox({TotalMoneyInMonth}) {
    return (
        <div className='CalenderInformation-div'>
            <h3 className='informationText-h3'>CALENDER</h3>
            <iframe title='Calender' src="https://calendar.google.com/calendar/embed?src=lqm231231%40gmail.com&ctz=Asia%2FHo_Chi_Minh"></iframe>
            <h2 className='TotalInMonthBox-h2'>Total in Month: {TotalMoneyInMonth.toLocaleString("vi-VN")} VND</h2>    
        </div>
    )
}
export default React.memo(CalenderBox);