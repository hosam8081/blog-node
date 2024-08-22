import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema ({
  firstName: {
    type: String,
    max: [20, 'max length for first name is 20']
  },
  lastName: {
    type: String,
    max: [20, 'max length for last name is 20']
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  image: {
    type: String,
    default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  permissions: {
    type: [String],
    default: [],
  },
});

const User = mongoose.model('User', UserSchema);

export default User;
