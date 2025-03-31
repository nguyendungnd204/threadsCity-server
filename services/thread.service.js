const Thread = require('../models/thread.model');

class ThreadService {
    async createThreadService(authorId, content, image){
        const thread = await Thread.create({authorId, content, image});
        return thread;
    }
}
module.exports = new ThreadService();