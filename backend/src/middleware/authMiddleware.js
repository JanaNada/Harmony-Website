const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
	try {
		
		const token = req.cookies.token;

		if (!token) {
		return res.status(401).json({
			success: false,
			message: "Authentication required",
		});
		}

		const decoded = jwt.verify( // verifies the jwt token
		token,
		process.env.JWT_SECRET
		);

		req.user = decoded;

		next();

	} 
	catch (error) {

		return res.status(401).json({
		success: false,
		message: "Invalid or expired authentication",
		});
  	}
};

/**
 * Attaches req.user when a valid token is present, but lets the request
 * through either way. Used for endpoints that show more to a signed-in user
 * without being closed to visitors — free meeting times, for instance.
 */
const optionalAuthenticate = (req, res, next) => {
	try {
		const token = req.cookies.token;
		if (token) {
			req.user = jwt.verify(token, process.env.JWT_SECRET);
		}
	} catch {
		// An expired or malformed token just means "treat them as a visitor".
	}
	next();
};

const authorize = (...allowedRoles) => {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });

        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
        next();
    };
};


module.exports = {
    authenticate,
    optionalAuthenticate,
    authorize
};