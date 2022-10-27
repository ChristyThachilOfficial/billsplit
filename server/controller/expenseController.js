const db = require('../config/db')

module.exports = {
    createExpense: async (req, res) => {
        await db.get().collection('expense').insertOne({
            friends: req.body.personName,
            expense: req.body.expense,
            paidby: {
                name: req.body.decoded.username,
                userId: req.body.decoded.userId
            },
            totalPersons: req.body.personName.length + 1
        }).then(() => {
            res.status(201).json({
                message: "expense created",

            })
        }).catch((err) => {
            return res.status(500).json({
                error: err
            })
        })
    },

    getExpenses: async (req, res) => {
        let expenses = await db.get().collection('expense').find({ "paidby.userId": req.params.userId }).toArray()
        if (expenses) {
            res.status(200).json({
                message: "fetched successfully",
                expense: expenses
            })
        } else {
            res.status(404).json({
                message: "expense not found"
            })
        }

    },

    getPendingBills: async (req, res) => {
        let username = req.params.username
        try {
            let bills = await db.get().collection('expense').find({ friends: { $all: [username] } }).toArray()
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