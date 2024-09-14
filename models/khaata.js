const mongoose=require("mongoose")

    const khataModel = new mongoose.Schema({
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        khata: [{
            date: {
                type: String, // Store the date as a string in the format "DD-MM-YYYY"
                default: " "
            },
            data: {
                type: String,
                required: true
            },
            khataname:
            {
                type:String
            },
            code:
            {
                type:String,
                default:null
            }
        }]
    });
const khata=mongoose.model('khata',khataModel)
module.exports=khata