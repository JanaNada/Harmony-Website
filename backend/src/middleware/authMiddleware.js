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
    authorize
};