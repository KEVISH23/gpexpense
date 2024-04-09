const Expense = require('../models/expenseSchema')

const addExpense = async (req, res) => {
    try {
        const expense = await Expense.create(req.body)
        res.status(200).json({ success: true, msg: 'expense added successfully' })
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Add expense Error' })
    }
    
}

const getExpenseByEmail = async (req, res) => {
    try {
        let { email } = req.params;
        const expense = await Expense.find({ email })
        if (!expense.length) {
            res.status(200).json({ success: false, msg: 'Not found any data',expense })
        } else {
            let date = new Date()
            let days_7 = expense.filter(data => {
                let enterDate = new Date(data.date)
                let diff = ((date - enterDate) / (1000 * 60 * 60 * 24))
                return diff >= 0 && diff <= 7
            })
            let days_30 = expense.filter(data => {
                let enterDate = new Date(data.date)
                let diff = Math.ceil(((date - enterDate) / (1000 * 60 * 60 * 24)))
                return diff >= 0 && diff <= 30
            })
            let days_6m = expense.filter(data => {
                let enterDate = new Date(data.date)
                let diff = Math.ceil(((date - enterDate) / (1000 * 60 * 60 * 24)))
                return diff >= 0 && diff <= 180
            })
            let days_12m = expense.filter(data => {
                let enterDate = new Date(data.date)
                let diff = Math.ceil(((date - enterDate) / (1000 * 60 * 60 * 24)))
                //console.log(diff)
                return diff >= 0 && diff <= 366
            })
            res.status(200).json({ success: true, msg: 'expense fetched successfully', expense,days_7,days_30,days_6m,days_12m })
        }
    } catch (error) {
        //console.log(error)
        res.status(500).json({ success: false, msg: 'fetch expense Error' })
    }
}

const updateById = async (req, res) => {
    try {
        let { id } = req.params;
        const expense = await Expense.findByIdAndUpdate(id, req.body)
        if (!expense) {
            res.status(404).json({ success: false, msg: 'Not found any data' })
        } else{
            res.status(200).json({ success: true, msg: 'expense updated successfully', expense })
        }
    } catch (error) {
        //console.log(error)
        res.status(500).json({ success: false, msg: 'update expense Error' })
    }
}

const deleteById = async (req, res) => {
    try {
        let { id } = req.params;
        const expense = await Expense.findByIdAndDelete(id)
        if (!expense) {
            res.status(404).json({ success: false, msg: 'Not found any data' })
        } else {
            res.status(200).json({ success: true, msg: 'expense deleted successfully', expense })
        }
    } catch (error) {
        //console.log(error)
        res.status(500).json({ success: false, msg: 'delete expense Error' })
    }
}

module.exports = {
    addExpense,
    getExpenseByEmail,
    updateById,
    deleteById
}