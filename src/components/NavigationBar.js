//
import React from "react";

//
function NavigationBar() {
    return (
        <div className='left-navigation-bar-div'>
            <a href='https://mail.google.com/mail/' target='_blank' rel="noreferrer" className='mail-link-a'>
                <i class="gg-mail"></i>
            </a>
        </div>
    )
}
export default React.memo(NavigationBar);