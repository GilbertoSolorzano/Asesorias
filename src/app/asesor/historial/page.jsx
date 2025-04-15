import AsesorDataGraph from '@/components/AsesorDataGraph'
import AsesorSecCard from '@/components/AsesorSecCard'
import HamburgerMenu from '@/components/HamburgerMenu'
import React from 'react'

const HistorialPage = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <aside className="bg-[#212227] w-full md:w-20 flex flex-col items-center py-4 md:h-full min-h-[60px]">
        <HamburgerMenu role="asesor" />
      </aside>
  
      <div className="flex flex-col items-center bg-white w-full h-full">
        <div className="w-full h-64 sm:h-80 md:h-96 mb-6 flex items-center justify-center">
          <AsesorDataGraph />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full justify-center gap-4 p-4 overflow-y-auto">
          <AsesorSecCard />
          <AsesorSecCard />
          <AsesorSecCard />
        </div>
      </div>
    </div>
  )
}

export default HistorialPage
