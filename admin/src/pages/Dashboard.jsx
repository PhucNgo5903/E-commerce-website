import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { Line } from 'react-chartjs-2'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend)

const StatCard = ({title, value}) => (
  <div className='bg-white p-4 rounded shadow-sm'>
    <p className='text-sm text-gray-500'>{title}</p>
    <p className='text-2xl font-semibold mt-2'>{value}</p>
  </div>
)

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({ totalSales:0, totalOrders:0, totalCustomers:0, salesByDay:[], topProducts:[] })

  const fetchStats = async () => {
    if (!token) return
    try {
      const res = await axios.get(backendUrl + '/api/order/stats', { headers: { token } })
      if (res.data.success) {
        setStats(res.data)
      }
    } catch (err) {
      console.log('Fetch stats error', err)
    }
  }

  useEffect(()=>{ fetchStats() }, [token])

  const labels = stats.salesByDay.map(s => s._id)
  const data = {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: stats.salesByDay.map(s => s.total),
        borderColor: 'rgba(99,102,241,1)',
        backgroundColor: 'rgba(99,102,241,0.2)'
      }
    ]
  }

  const donutData = {
    labels: ['New Customers','Returning'],
    datasets: [{ data: [stats.totalCustomers, Math.max(0, stats.totalOrders - stats.totalCustomers)], backgroundColor: ['#6366F1', '#A78BFA'] }]
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white p-6 rounded shadow-sm'>
          <p className='text-sm text-gray-500'>Sales (last 7 days)</p>
          <div className='h-64'>
            <Line data={data} />
          </div>
        </div>
        <div className='bg-white p-6 rounded shadow-sm'>
          <p className='text-sm text-gray-500'>Customer Ratio</p>
          <div className='h-64 flex items-center justify-center'>
            <Doughnut data={donutData} />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatCard title='Total Sale' value={`${currency}${stats.totalSales}`} />
        <StatCard title='Total orders' value={stats.totalOrders} />
        <StatCard title='Total customers' value={stats.totalCustomers} />
      </div>

      <div className='bg-white p-6 rounded shadow-sm'>
        <p className='text-lg font-semibold mb-4'>Top Selling Products</p>
        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead>
              <tr className='text-gray-500 text-sm'>
                <th className='py-2'>No</th>
                <th className='py-2'>Product</th>
                <th className='py-2'>Qty Sold</th>
                <th className='py-2'>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((p, idx) => (
                <tr key={p._id} className='border-t'>
                  <td className='py-2'>{idx+1}</td>
                  <td className='py-2 flex items-center gap-3'>
                    <img src={(p.image && p.image[0]) ? p.image[0] : assets.parcel_icon} className='w-10 h-10 object-cover' alt='' />
                    <span>{p.name}</span>
                  </td>
                  <td className='py-2'>{p.qtySold}</td>
                  <td className='py-2'>{currency}{p.totalSales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
