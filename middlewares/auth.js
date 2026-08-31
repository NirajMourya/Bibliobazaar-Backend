import jwt from "jsonwebtoken"
import users from "../models/userModel"

const authenticateToken = (req, res, next) => {  
  const authHeader = req.headers['authorization'] 
  const token = authHeader && authHeader.split(' ')[1] 

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);
    try {
      // Reject tokens issued before the user's last logout
      const user = await users.findById(decoded.userId).select('tokenVersion');
      if (!user || (decoded.tokenVersion || 0) !== (user.tokenVersion || 0)) {
        return res.sendStatus(401);
      }
      req.user = decoded;
      next();
    } catch (error) {
      return next(error);
    }
  });
}

const generateAccessToken = ({ emailId, userId, tokenVersion = 0 }) => {
  return jwt.sign({ emailId, userId, tokenVersion }, process.env.TOKEN_SECRET, {
    expiresIn: "240h",
  });
}

export { authenticateToken, generateAccessToken }
