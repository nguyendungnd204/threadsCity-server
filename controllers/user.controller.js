const UserService = require('../services/user.service');

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { bio, avatar } = req.body;
        const user = await UserService.updateUserService(id, bio, avatar);
        return res.status(200).json({
            message: 'User updated successfully',
            data: user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}