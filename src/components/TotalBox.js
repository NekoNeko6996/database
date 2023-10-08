//
import React from "react";

//
function TotalBox({TotalMoney}) {
    console.log(TotalMoney);
    return(
        <div className='TotalBox-div'>
            <h2 className='Total-h2'>Total: {TotalMoney.toLocaleString("vi-VN")} VND</h2>
        </div>
    )
}
export default React.memo(TotalBox);