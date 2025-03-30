const User = require('../models/user.model');

class UserService {
    async updateUserService(id, bio, avatar){
        const user = await User.findOne(id);
        if(!user){
            throw new Error('User not found');
        }
        if (avatar) {
            user.avatar = avatar;
        }
        if (bio) {
            user.bio = bio;
        }    
        await user.save();
        return user;
    }
}
module.exports = new UserService();