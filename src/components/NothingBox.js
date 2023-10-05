import React from "react";

//box nothing//
function NothingBox() {
    console.log('render: nothingBox');
    return (
        <div className='NothingBox-div'>
            <img width="48" height="48" src="https://img.icons8.com/pulsar-color/48/nothing-found.png" alt="nothing-found" id='nothing-icon'/>
            <p className='nothingText-p'>Hmm... Nothing To See Here</p>
        </div>
    )
}

export default React.memo(NothingBox);