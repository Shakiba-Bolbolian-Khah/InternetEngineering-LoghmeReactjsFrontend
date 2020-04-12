import React from 'react';
import PropTypes from 'prop-types';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  align-self: center;
`;

function Spinner(){
    return(
        <div className="sweet-loading">
            <ClipLoader
                css={override}
                size={50}
                color={"#123abc"}
                loading= {true}
            />
        </div>
    )
}

export default Spinner;