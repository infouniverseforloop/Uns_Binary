// backend/userManager.js
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname,'..','data','users.json');
let users = [];
try{ if(fs.existsSync(FILE)) users = JSON.parse(fs.readFileSync(FILE,'utf8')); }catch(e){}
function save(){ try{ fs.writeFileSync(FILE, JSON.stringify(users,null,2)); }catch(e){} }
function addUser(u){ users.push(u); save(); }
function loadUsers(){ return users; }
function validateToken(t){ return users.some(u=>u.token === t) || (t === process.env.ADMIN_TOKEN); }
module.exports = { addUser, loadUsers, validateToken };
