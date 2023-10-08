//
import React from "react";

//
function RemainingBox({RemainingMoney}) {
    return (
        <div className='RemainingBox-div'>
            <h2 className='Remaining-h2'>Remaining: {RemainingMoney.toLocaleString("vi-VN")} VND</h2>
        </div>
    )
}
export default React.memo(RemainingBox);