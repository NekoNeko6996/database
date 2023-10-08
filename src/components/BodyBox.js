//
import React from "react";

//
function BodyBox({ItemHtml}) {
    return (
        <div className='body-box-div'>
            {ItemHtml}
        </div>
    )
}
export default React.memo(BodyBox);