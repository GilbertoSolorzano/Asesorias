import HamburgerMenu from '@/components/HamburgerMenu'
import React from 'react'

const PerfilPage = () => {
  return (
    <div className="flex h-screen relative">
      <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
        <HamburgerMenu  role="asesor"/>
      </aside>
    </div>
  )
}

export default PerfilPage
