import React from 'react'
//One card for features
function Featurescard({title,iconsrc}) {
  return (
    <div className='flex flex-col items-center p-6 bg-white rounded-2xl border-gray-200 border shadow-lg hover:shadow-xl transition-all cursor-pointer text-center hover:-translate-y-0.5'>
       <img src={iconsrc} alt={title} className='w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6' />
       <p className='text-sm sm:text-base font-semibold text-gray-700'>{title}</p>
    </div>
  )
}

export default Featurescard