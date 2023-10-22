//
import React from "react"

//
const loadingBox = () => {



    return (
        <div id="loading-box-container">
            <div id="loading-box">
                <span id="span1">
                    <div className="loading-box-child" id="loading-box-child-1"></div>
                    <div className="loading-box-child" id="loading-box-child-2"></div>
                    <div className="loading-box-child" id="loading-box-child-3"></div>
                </span>
                <span id="span2">
                    <p>Loading please wait...</p>
                </span>
            </div>
        </div>
    )
}
export default React.memo(loadingBox);