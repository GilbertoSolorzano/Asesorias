'use client'
import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Registrar lo necesario
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const AsesorDataGraph = () => {
    const data = {
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
        datasets: [
            {
                label:"Horas de asesorías",
                data:[5, 3, 6, 4, 5, 3],
                backgroundColor:'#66D575',
                borderColor:'rgba(34,197,94,1)',
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    }

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
                grid: {
                    color: 'rgba(0,0,0,0.05)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 rounded-lg bg-white">
        <h2 className="text-2xl font-bold text-center mb-4">
        Tus asesorías realizadas!
        </h2>
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-80 xl:h-96">
            <div className="w-full h-full bg-blue-200 rounded-md p-4 mb-6 flex items-center justify-center">
                <Bar data={data} options={barOptions} />
            </div>
        </div>
    </div>
  )
}

export default AsesorDataGraph
