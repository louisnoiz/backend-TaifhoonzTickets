const pool = require("../config");
async function logger(req, res, next) {
  const timestamp = new Date().toISOString().substring(0, 19)
  console.log(`${timestamp} | ${req.method}: ${req.originalUrl}`)
  next()
}
async function isLoggedIn(req, res, next) {
  let authorization = req.headers.authorization

  if (!authorization) {
    return res.status(401).send('You are not logged in')
  }

  let [part1, part2] = authorization.split(' ')
  if (part1 !== 'Bearer' | !part2) {
    return res.status(401).send('You are not logged in')
  }

  // Check token
  const [tokens] = await pool.query('SELECT * FROM customer_tokens WHERE token = ?', [part2])
  const token = tokens[0]
  if (!token) {
    const [tokens2] = await pool.query('SELECT * FROM admin_tokens WHERE token = ?', [part2])
    const token = tokens2[0]
    const [users] = await pool.query(
      'SELECT admin_email, admin_id ' +
      'FROM admin WHERE admin_id = ?', [token.user_id]
    )
    users[0].email_id = 'admin ' + users[0].admin_id
    users[0].role = 'admin'
    users[0].cid = users[0].admin_id
    req.user = users[0]
  }else if(token){
        // Set user
    const [users] = await pool.query(
      'SELECT cid, email_id, c_name, phone_no ' +
      'FROM customer WHERE cid = ?', [token.user_id]
    )
    users[0].role = 'customer'
    req.user = users[0]
  }else{
    return res.status(401).send('You are not logged in')
  }


  next()
}

module.exports = {
  logger,
  isLoggedIn
}