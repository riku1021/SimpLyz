import React from 'react'
import './Analysis.css'

function Plt({image}) {
  return (
    <div className='plt-wrapper'>
      {image && (
        <img src={`data:image/png;base64,${image}`} alt="Seaborn Plot" />
      )}
    </div>
  )
}

export default Plt
