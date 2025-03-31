const ThreadService = require('../services/thread.service');

exports.createThread = async (req, res) => {
    const {id} = req.params;
    const {content, image} = req.body;

    if(content == ''){
        return res.status(400).json({
            message: 'content is required',
            success: false
        })
    }

    const thread = await ThreadService.createThreadService(id, content, image);
    return res.status(201).json({
        message: 'thread created successfully',
        data: thread
    })
}