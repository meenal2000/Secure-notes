const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs') 
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    age : {
        type : Number,
        default : 1
        ,
        validate(value){
            if(value <= 0)
                {
                    throw new Error('Age must be a positive number')
                }
        }
    },
    email : {
        type : String,
        required : true,
        unique : true, // makes email an index
        trim : true,
        lowercase : true
        ,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('not a valid email')
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true
        ,
        validate(value) {
            if(value.length<=6 || value.toLowerCase().includes('password'))
            {
                throw new Error ('invalid password')
            }
        }
    },
    tokens:[
        {
            token : {
                type : String ,
                required : true
            }
        }
    ],
    avatar : {
        type : Buffer
    }
}, {
    timestamps : true
})

// setting virtual properties , not real . 
// it is just a way for mongoose to set up the relationship btw the two.
// we aren't changing what we store for the user document
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// these are instance methods , acts on a single instance
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign( { _id : user._id.toString() } , process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token;  
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

// these are model methods
userSchema.statics.findByCredentials = async(email , password) => {
    const user = await User.findOne({email})
    if(!user)
    {
        throw new Error('Unable to login')
    }
   // console.log(user)
    const isMatch = await bcrypt.compare(password , user.password)
    if(!isMatch)
    {
        //console.log('not true')
        throw new Error('Unable to login')
    }
    return user; 
}
// hash the plain text password before saving
userSchema.pre('save' , async function(next) { // can't use this with arrow functions
    const user = this
    if(user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password , 8)
    }
    next() // tells that we have performed our operations  of where before our user is saved
})
// delete user tasks when user is removed
userSchema.pre('remove' , async function(next) {
    const user = this
    await Task.deleteMany({owner : user._id})
    next()
})
const User = mongoose.model(
    'User',
    userSchema
)
module.exports = User