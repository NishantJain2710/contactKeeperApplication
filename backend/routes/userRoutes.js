import express from 'express'
const router = express.Router()

import {
    forgetPassword, 
    getUserProfile, 
    login, 
    registerUser,
    updateClientName,
    updateClientUserName,
    updateClientPhoneNumber,
    updateClientEmail,
    updateClientProfileImage
} from '../controllers/userControllers.js'
import { protect } from '../middleware/authMiddleware.js'
import {upload} from '../middleware/uploadMiddleware.js'


// /api/users

router.route('/')
        .post(upload.single('profileImage'), registerUser)
        
router.get('/login',login)

router.route('/profile')
        .get(protect,getUserProfile)

router.put('/updateprofile/name',protect,updateClientName)
router.put('/updateprofile/username',protect,updateClientUserName)
router.put('/updateprofile/email',protect,updateClientEmail)
router.put('/updateprofile/phonenumber',protect,updateClientPhoneNumber)
router.put('/updateprofile/profileimage',upload.single('profileImage'),protect,updateClientProfileImage)

router.put('/changepassword',forgetPassword);

export default router;