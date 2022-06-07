const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  links: [{ type: Types.ObjectId, ref: 'Link' }],
});

const statuses = {
  active: 'active',
  inactive: 'inactive',
};

const User = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  status: { type: String, required: true, default: statuses.active },
  password: { type: String, required: true },
  registrationDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  lastLoginDate: { type: Date },
});

module.exports = model('user', User);
