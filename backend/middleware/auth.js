import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    // Accept token either as custom header `token` or standard `Authorization: Bearer <token>`
    let token = req.headers.token || '';
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!token && authHeader) {
        // support "Bearer <token>" format
        const parts = authHeader.split(' ');
        if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
            token = parts[1];
        } else {
            token = authHeader; // fallback if token sent directly
        }
    }

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again' })
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log('Auth error:', error.message)
        res.json({ success: false, message: error.message })
    }
}


export default authUser