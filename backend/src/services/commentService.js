const commentRepo = require("../repositories/commentRepository");
const sanitize = require("../utils/sanitize");
 
async function addComment(rawContent) {
    const clean = sanitize(rawContent);
    return await commentRepo.insertComment(clean);
}
 
async function getComments() {
    return await commentRepo.getAllComments();
}
 
module.exports = { addComment, getComments };