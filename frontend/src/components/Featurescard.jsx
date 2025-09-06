import React from 'react'
//One card for features
function Featurescard({title,iconsrc}) {
  return (
    <div className='flex flex-col items-center p-6 bg-white rounded-2xl border-gray-200 border shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-center'>
       <img src={iconsrc} alt={title} className='w-25 h-25 mb-6'></img>
       <p className='text-base font-semibold text-gray-700'>{title}</p>
    </div>
  )
}

export default Featurescard