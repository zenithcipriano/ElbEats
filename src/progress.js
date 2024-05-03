import React  from 'react';
import { ThreeDots } from 'react-loader-spinner';

function ProgressBar1 ({height}) {
    return <div>
        <table align="center" style={{position: "relative"}}><tr><td>
        <ThreeDots visible={true} 
        height={height}
        width={height}
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