import React from 'react';
import PropTypes from 'prop-types';
import '../CSS/Normalize.css';
import '../CSS/basicStyles.css';
import '../CSS/infoBarStyles.css';
import '../CSS/profileStyles.css';
import '../media/FlatIcon/font/flaticon.css';

String.prototype.toPersianDigits= function(){
    var id = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return this.replace(/[0-9]/g, function(w){
        return id[+w]
    });
}

class InfoBar extends React.Component {
    render(){
        if(this.props.type === "profile"){
            return(
                <div className="row infoBar">
                    <div className="infoBarUserDetails">
                        <div className="infoBarDetailData">
                            <i className="flaticon-loghme-phone"></i>
                            <div>{this.props.value.phoneNumber}</div>
                        </div>
                        <div className ="infoBarDetailData">
                            <i className="flaticon-loghme-mail"></i>
                            <div>{this.props.value.email}</div>
                        </div>
                        <div className="infoBarDetailData">
                            <i className="flaticon-loghme-card"></i>
                            <div>{String(this.props.value.credit).toPersianDigits()} تومان</div>
                        </div>
                    </div>
                    <div className="infoBarUsername">
                        <i className="flaticon-loghme-account"></i>
                        <div>{this.props.value.firstName} {this.props.value.lastName}</div>
                    </div>
                </div>
            )
        }
        else if(this.props.type === "restaurant"){
            return(
                <div className="row infoBar"></div>
            )
        }
        else if(this.props.type === "home") {
            return(
                <div className="row searchBarBg">
                    <div className="searchBarEffect">
                    </div>
                </div>
            )
        }
    }
}

export default InfoBar;