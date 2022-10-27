const db = require('../config/db')

module.exports = {
    createGroup: async (req, res) => {
            await db.get().collection('group').insertOne({
                groupName: req.body.groupName,
                friends: req.body.personName,
                expense: req.body.expense,
                paidby: {
                    name: req.body.decoded.username,
                    userId:req.body.decoded.userId
                },
                totalPersons: req.body.personName.length +1
            }).then(() => {
                res.status(201).json({
                    message: "group created",
                    
                })
            }).catch((err) => {
                return res.status(500).json({
                    error: err
                })
            })
        
       
    },

    getGroups: async (req, res) => {
        
        let groups = await db.get().collection('group').find({ "paidby.userId": req.params.userId }).toArray()
        if (groups) {
                res.status(200).json({
                    message: "fetched successfully",
                    groups: groups
                })
            } else {
                res.status(404).json({
                    message: "groups not found"
                })
            }
        
        
    },

    getPendingBills: async (req, res) => {
        let username = req.params.username
        try {
            let bills = await db.get().collection('group').find({ friends: { $all: [username] } }).toArray()
            if (bills.length > 0) {
                bills.map((bill) => bill.borrowed = true)
                res.status(200).json({
                    message: 'successfully fetched',
                    bills: bills
                })
            } else {
                res.status(404).json({
                    message: "bills not found"
                })
            }
        } catch (err) {
            return res.status(500).json({
                error: err
            })
        } 
        
       
    }
}