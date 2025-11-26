import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js'

// Placin orders using COD-CastOnDelivery Method

const placeOrder = async (req, res) => {

    try {
        
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount, 
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)  
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData:{}})

        res.json({success:true, message:"Order Placed"})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }

}


// Placin orders using Stripe Method

const placeOrderStripe = async (req, res) => {
    
}


// Placin orders using Razorpay Method

const placeOrderRazorpay = async (req, res) => {
    
}


// All Orders data for Admin Panel
const allOrders = async (req, res) => {
    
    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders })


    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }

}


//User Order Data for Frontend
const userOrders = async (req, res) => {
    try {

        const  {userId} = req.body

        const orders = await orderModel.find({ userId })
        res.json({success:true, orders})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}


//Update Order status form Admin Panel
const updateStatus = async (req, res) => {
    try {
        
        const { orderId, status } = req.body
        
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true, message:'Status Updated'})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}


export {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus}

// Dashboard stats for Admin
const dashboardStats = async (req, res) => {
    try {
        const sevenDays = Date.now() - 7 * 24 * 60 * 60 * 1000

        const agg = await orderModel.aggregate([
            {
                $facet: {
                    totalSales: [
                        { $match: { status: 'Delivered' } },
                        { $group: { _id: null, total: { $sum: '$amount' } } }
                    ],
                    totalOrders: [
                        { $match: { status: 'Delivered' } },
                        { $count: 'count' }
                    ],
                    totalCustomers: [
                        { $match: { status: 'Delivered' } },
                        { $group: { _id: '$userId' } },
                        { $count: 'count' }
                    ],
                    salesByDay: [
                        { $match: { date: { $gte: sevenDays }, status: 'Delivered' } },
                        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: { $toDate: '$date' } } }, total: { $sum: '$amount' } } },
                        { $sort: { _id: 1 } }
                    ],
                    topProducts: [
                        { $match: { status: 'Delivered' } },
                        { $unwind: '$items' },
                        { $group: { _id: '$items._id', name: { $first: '$items.name' }, image: { $first: '$items.image' }, qtySold: { $sum: '$items.quantity' }, totalSales: { $sum: { $multiply: ['$items.quantity', '$items.price'] } } } },
                        { $sort: { qtySold: -1 } },
                        { $limit: 10 }
                    ]
                }
            }
        ])

        const result = agg[0] || {}

        const totalSales = result.totalSales && result.totalSales[0] ? result.totalSales[0].total : 0
        const totalOrders = result.totalOrders && result.totalOrders[0] ? result.totalOrders[0].count : 0
        const totalCustomers = result.totalCustomers && result.totalCustomers[0] ? result.totalCustomers[0].count : 0
        const salesByDay = result.salesByDay || []
        const topProducts = result.topProducts || []

        res.json({ success: true, totalSales, totalOrders, totalCustomers, salesByDay, topProducts })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {dashboardStats}