const Income = require('../models/Income');

const addIncome = async (req, res) => {
    try {

        const { amount, source, date } = req.body;

        if (!amount || !source) {
            return res.status(400).json({
                success: false,
                msg: "Amount & Source are Required",
            })
        }

        const income = await Income.create({
            user: req.user._id,
            amount,
            source,
            date,
        });

        res.status(201).json({
            success: true,
            income
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

const getIncome = async (req, res) => {
    try {

        const incomes = await Income.find({
            user: req.user._id
        });

        res.status(200).json({
            success: true,
            incomes
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message,
        })
    }
}

const deleteIncome = async (req, res) => {
    try {

        const income = await Income.findById(req.params.id);

        if (!income) {
            return res.status(404).json({
                success: false,
                msg: "Income Not Found",
            })
        }

        await Income.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            msg: "Income Deleted Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            msg: error.message,
        })
    }
}

const updateIncome = async(req,res) => {
    try {
        
        const { id } = req.params;
        const { amount, source, date } = req.body

        const income = await Income.findByIdAndUpdate( id, 
            { amount, source, date},
            { new : true }
        );

        if(!income) {
            return res.status(404).json({
                success : false,
                msg : "Income not found"
            })
        }

        res.status(200).json({
            success : true,
            msg: "Income updated successfully",
            income
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            msg : error.message
        })
    }
}


module.exports = { addIncome, getIncome, deleteIncome, updateIncome }