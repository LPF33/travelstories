import React from "react";

const Loading = () => {
    return(
        <div className="loading">
            <div className="loading-circle1">
                <div className="circle1"></div>
            </div>
            <div className="loading-circle2">
                <div className="circle2"></div>
            </div>
            <div className="loading-circle3">
                <div className="circle3"></div>
            </div>
            <div className="loading-circle4">
                <div className="circle4"></div>
            </div>
            <div className="loading-circle5">
                <div className="circle5"></div>
            </div>
            <div className="loading-text">
                Wait...
            </div>
        </div>
    );
};

export default Loading;