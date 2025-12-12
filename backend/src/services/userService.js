const axios = require("axios");
const bcrypt = require("bcrypt");
const userRepo = require("../repositories/userRepository");
 
async function populateUsers() {
  const urls = [1, 2, 3].map(() => axios.get("https://randomuser.me/api/"));
  const results = await Promise.all(urls);
 
  for (const r of results) {
    const u = r.data.results[0];
    const fullName = `${u.name.first} ${u.name.last}`;
    const hashedPassword = await bcrypt.hash(u.login.password, 10);
    await userRepo.insertUser(fullName, hashedPassword);
  }
}
 
async function getAllUsers() {
  return await userRepo.getAllUsers();
}
 
async function getUser(id) {
  return await userRepo.getUserById(id);
}
 
module.exports = {
  populateUsers,
  getAllUsers,
  getUser
};