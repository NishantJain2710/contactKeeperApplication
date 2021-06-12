import express from 'express'
const router = express.Router()

import {
    createContact,
    getContacts,
    updateContact,
    deleteContact
} from '../controllers/contactControllers.js'
import {protect} from '../middleware/authMiddleware.js'

// /api/contacts

router.route('/')
        .post(protect,createContact)
        .get(protect,getContacts)
router.route('/:id')
        .put(protect,updateContact)
        .delete(protect,deleteContact)

export default router;

