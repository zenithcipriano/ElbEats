import React  from 'react';
import { ThreeDots } from 'react-loader-spinner';

function ProgressBar1 () {
    return <div>
        <table align="center" style={{position: "relative"}}><tr><td>
        <ThreeDots visible={true} 
        height="200"
        width="200"
        color="#6e2323"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />
        </td></tr></table>
</div>
}
export default ProgressBar1;