import asyncHandler from 'express-async-handler'
import pool from "../config/db.js"


const createContact = asyncHandler(async(req,res)=>{
    try {
            const {name, email, phoneNumber} = req.body
            const newContact = await pool.query(
                "INSERT INTO contact (email , name , phone_no, user_id) VALUES($1, $2, $3, $4) RETURNING *"
                ,[email,name,phoneNumber,req.user.client_id]);
            res.status(200).json(newContact.rows[0]);
        } catch (err) {
            res.status(400)
            throw new Error(err.message);
        }
})

const getContacts = asyncHandler(async(req,res)=>{
    try {
        const contacts = await pool.query("SELECT contact_id, email, name, phone_no FROM contact WHERE user_id = $1",
        [req.user.client_id])
        res.status(200).json(contacts.rows)
        
    } catch (err) {
        res.status(400)
        throw new Error(err.message);
    }
})


const updateContact = asyncHandler(async(req,res)=>{
    try {
            const {name, email, phoneNumber} = req.body
            const contactId = req.params.id
            const contact = await pool.query("SELECT * FROM contact WHERE contact_id = $1 AND user_id = $2",
            [contactId,req.user.client_id])
            if(contact.rows[0]){
                if(name === ''){
                    name = contact.rows[0].name
                }
                if(email === ''){
                    email = contact.rows[0].email
                }
                if(phoneNumber === ''){
                    phoneNumber = contact.rows[0].phone_no
                }
                const updatedContact = await pool.query(
                    "UPDATE contact SET name = $1, email = $2, phone_no = $3 WHERE contact_id = $4 RETURNING contact_id, email, name, phone_no"
                    ,[name,email,phoneNumber, contactId]);
                res.status(404).json(updatedContact.rows[0])
            }else{
                res.status(404)
                throw new Error('Contact Not Found')
            }
        } catch (err) {
            res.status(400)
            throw new Error(err.message);
        }
})

const deleteContact = asyncHandler(async(req,res)=>{
    try {
            const contactId = req.params.id
            const contact = await pool.query("SELECT * FROM contact WHERE contact_id = $1 AND user_id = $2",
            [contactId,req.user.client_id])

            if(contact.rows[0]){
                await pool.query("DELETE FROM contact WHERE user_id = $1 AND contact_id = $2",
                [req.params.client_id, contactId])
                res.status(200).json({message:"Successfully Deleted"})
            }else{
                res.status(404)
                throw new Error('Contact not found..')
            }
        } catch (err) {
            res.status(400)
            throw new Error(err.message);
        }
})

export {
    createContact,
    getContacts,
    updateContact,
    deleteContact
}