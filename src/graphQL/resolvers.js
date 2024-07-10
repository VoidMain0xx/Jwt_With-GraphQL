import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/user.Model.js';

const resolvers = {
    Query: {
        me: async (_, __, context) => {
            const token = context.req.headers.authorization || '';
            if (!token) throw new Error('You are not authenticated');
            
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);
                return user;
            } catch (err) {
                throw new Error('You are not authenticated');
            }
        }
    },
    Mutation: {
        signup: async (_, { username, email, password }) => {
            const user = await User.findOne({ email });
            if (user) throw new Error('Email is already in use');

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });

            const res = await newUser.save();

            const token = jwt.sign({ id: res.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return {
                ...res._doc,
                id: res._id,
                token
            };
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error('User not found');

            const match = await bcrypt.compare(password, user.password);
            if (!match) throw new Error('Incorrect password');

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return {
                ...user._doc,
                id: user._id,
                token
            };
        }
    }
};

export default resolvers;
