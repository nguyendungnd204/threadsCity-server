const ThreadService = require('../services/thread.service');

exports.createThread = async (req, res) => {
    try {
        const {authorId} = req.query;
        const {content, image} = req.body;

        if(content == ''){
            return res.status(400).json({
                message: 'content is required',
                success: false
            })
        }

        const thread = await ThreadService.createThreadService(authorId, content, image);
        return res.status(201).json({
            message: 'thread created successfully',
            data: thread
        })
    } catch (error) {
        console.log(error);
    }
    
}