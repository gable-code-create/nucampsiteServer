const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
           
        },
        image: {
            type: String,
            required: true
            
        },
        featured: {
            type: String,
            required: false
            
        }, 
        description:{
            type: String,
            required: true
            
        }
    },
    {
        timestamps:  true
    }
);