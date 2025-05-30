'use client'
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip
} from 'chart.js'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

// Registrar lo necesario
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const AsesorDataGraph = ({matricula: matriculaAsesor}) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!matriculaAsesor) return; 
        const fetchGraphData = async () =>{
            try {
                const res = await fetch(`http://localhost:3001/api/asesor/graficar-asesorias?matricula=${matriculaAsesor}`);
                const rawData = await res.json();

                const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                const labels = rawData.map(d => `${meses[d.mes - 1]} ${d.anio}`);
                const values = rawData.map(d => d.total_asesorias);

                setData({
                    labels,
                    datasets: [
                        {
                        label: 'Asesorías finalizadas',
                        data: values,
                        backgroundColor: '#66D575',
                        borderColor: 'rgba(34,197,94,1)',
                        borderWidth: 1,
                        borderRadius: 6,
                        },
                    ],
                })
            } catch (err) {
                console.error('Error al obtener los datos del gráfico:', err)
            }
        }
        fetchGraphData()
    }, [matriculaAsesor])

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
                {data ? <Bar data={data} options={barOptions} /> : <p>Cargando gráfico...</p>}
            </div>
        </div>
    </div>
  )
}

export default AsesorDataGraph
