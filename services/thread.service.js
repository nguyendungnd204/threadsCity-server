const Thread = require('../models/thread.model');

class ThreadService {
    async createThreadService(id, content, image){
        const thread = await Thread.create({content, image});
        return thread;
    }
}

module.exports = new ThreadService();