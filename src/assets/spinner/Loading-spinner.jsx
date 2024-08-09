// const ComponentSpinner = () => {
//   return (
//     <div className='fallback-spinner'>
//       <div className='loading'>
//         <div className='effect-1 effects'></div>
//         <div className='effect-2 effects'></div>
//         <div className='effect-3 effects'></div>
//       </div>
//     </div>
//   )
// }

// export default ComponentSpinner


// PageLoader.js
import React from 'react';
import './pageloader.scss'
const PageLoader = () => {
  return (
    <div className="page-loader spin-wrap">
      <div className="spin-round-wrap">
        <div className="spin-round color-navy-blue">
          <span className='ballDot1'></span> 
          <span className='ballDot2'></span>
          <span className='ballDot3'></span>
          <span className='ballDot4'></span>
        </div>
      </div>
      <div className="loader"></div>
      <div className="snippet" data-title="dot-gathering">
          <div className="stage filter-contrast">
            <div className="dot-gathering"></div>
          </div>
        </div>
      <div className="spin-round-wrap">
        <div className="spin-round">
          <span className='ballDot1'></span> 
          <span className='ballDot2'></span>
          <span className='ballDot3'></span>
          <span className='ballDot4'></span>
        </div>
      </div>
    </div>
  );
};
export default PageLoader;


