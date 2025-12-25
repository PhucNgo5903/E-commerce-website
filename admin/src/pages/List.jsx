import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'


// Inline component to add size (dropdown)
const AddSizeInput = ({ productId, onAdded, token }) => {
  const [value, setValue] = useState('')
  const allowed = ['S','M','L','XL','XXL']

  const addSize = async () => {
    const size = value
    if (!size) return
    try {
      const res = await axios.post(backendUrl + '/api/product/add-size', { productId, size }, { headers: { token } })
      if (res.data.success) {
        toast.success('Size added')
        setValue('')
        onAdded()
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }
  return (
    <div className='flex gap-1 mt-2 items-center'>
      <select value={value} onChange={(e) => setValue(e.target.value)} className='text-xs px-2 py-1 border rounded bg-white'>
        <option value=''>Select size</option>
        {allowed.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button onClick={addSize} disabled={!value} className={`text-xs px-2 rounded ${value ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>Add</button>
    </div>
  )
}

const List = ({token}) => {

  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      
      const response = await axios.get(backendUrl + '/api/product/list')
      console.log(response.data);
      if (response.data.success) {
        setList(response.data.products);
      }
      else{
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
  }

  const removeProduct = async (id) => {
      try {
        
        const response = await axios.post(backendUrl + '/api/product/remove', {id}, {headers:{token}})
        if (response.data.success) {
          toast.success(response.data.message)
          await fetchList();
        } else{
          toast.error(response.data.message)
        }

      } catch (error) {
        console.log(error);
        toast.error(error.message)
      }
  }


  useEffect(()=>{
    fetchList()
  },[])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/*---------------------- List Table Title ---------------------------- */}

          <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Sizes</b>
            <b className='text-center'>Action</b>
          </div>

        {/*---------------------- Product List -------------------------------- */}

          {
            list && list.length > 0 ? (
            list.map((item, index) => (
                <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 px-1 py-2 border text-sm' key={index}>
                    <img className='w-12' src={item.image[0]} alt='' />
                    <p>{item.name}</p>
                    <p>{item.category}</p>
                    <p>{currency}{item.price}</p>
                    <div>
                      {/* show sizes badges (sorted) */}
                      {item.sizes && item.sizes.length > 0 ? (
                        <div className='flex gap-2 flex-wrap'>
                          {(() => {
                            const order = ['S','M','L','XL','XXL']
                            const normalized = item.sizes.map(s => String(s).toUpperCase())
                            const sorted = [...normalized].sort((a,b) => {
                              const ia = order.indexOf(a)
                              const ib = order.indexOf(b)
                              if (ia === -1 && ib === -1) return a.localeCompare(b)
                              if (ia === -1) return 1
                              if (ib === -1) return -1
                              return ia - ib
                            })
                            return sorted.map((s, i) => (
                              <div key={i} className='relative inline-block'>
                                <span className='px-2 py-1 bg-gray-200 rounded text-xs inline-block'>{s}</span>
                                <button onClick={async () => { try { const res = await axios.post(backendUrl + '/api/product/remove-size', { productId: item._id, size: s }, { headers: { token } }); if (res.data.success) { toast.success('Size removed'); fetchList(); } else { toast.error(res.data.message) } } catch(err){ console.log(err); toast.error(err.message) } }} className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center'>x</button>
                              </div>
                            ))
                          })()}
                        </div>
                      ) : (
                        <span className='text-gray-400 text-xs'>No sizes</span>
                      )}
                      {/* add size input for this product */}
                      <AddSizeInput productId={item._id} onAdded={fetchList} token={token} />
                    </div>
                    <p onClick={() => removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
                </div>
            ))
          ) : (
            <p>There is no product</p>
          )
          }

      </div>
    </>
  )
}

export default List
