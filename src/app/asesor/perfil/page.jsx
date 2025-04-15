import HamburgerMenu from '@/components/HamburgerMenu'
import React from 'react'

const PerfilPage = () => {
  return (
    <div className='flex flex-col md:flex-row h-screen'>
      <aside className="bg-[#212227] w-full md:w-20 flex flex-col items-center py-4 md:h-full min-h-[60px]">
        <HamburgerMenu role="asesor" />
      </aside>
    </div>
  );
  
}

export default PerfilPage
