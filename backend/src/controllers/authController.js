const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const generateToken = (user) => {
  
  return jwt.sign( // Create a JWT token for the user using their ID and role. 
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

/* 
store the JWT in a cookie
    httpOnly: malicious scripts cannot directly read the cookie.
    secure: only send the cookie over HTTPS.
    sameSite: helps protect against certain cross site request attacks.
*/

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  });
};

const registerCompany = async (req, res) => {

  let connection;

  try {

    const {
      companyName,
      contactName,
      contactPhone,
      email,
      password,
    } = req.body;

    if (!companyName || !contactName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Company name, contact name, email, and password are required",
      });
    }

    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    /*
      mysql2 returns query results as an array.
      If no user exists:
        existingUsers = []
      If one exists:
        existingUsers = [
          { id: 5 }
        ]
    */

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10); // hash password

    connection = await db.getConnection(); // start database connection

    await connection.beginTransaction();

    const [userResult] = await connection.query( // create company account in USERS  table
      `
        INSERT INTO users (email, password_hash, role)
        VALUES (?, ?, 'COMPANY')
      `,
      [email, passwordHash]
    );

    const userId = userResult.insertId; // store the foreign key for the companies table

    const [companyResult] = await connection.query( // create company account in COMPANIES table
      `
        INSERT INTO companies
          (user_id, company_name, contact_name, contact_phone)
        VALUES (?, ?, ?, ?)
      `,
      [
        userId,
        companyName,
        contactName,
        contactPhone || null,
      ]
    );

    await connection.commit();

    const token = generateToken({
      id: userId,
      role: "COMPANY",
    });

    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Company registered successfully",

      user: {
        id: userId,
        email,
        role: "COMPANY",
      },

      company: {
        id: companyResult.insertId,
        companyName,
        contactName,
        contactPhone: contactPhone || null,
      },
    });

  } catch (error) {

    if (connection) { // if something went wrong, rollback the edits
      await connection.rollback();
    }

    console.error("Company registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register company",
    });

  } finally {

    if (connection) { // free up the connection
      connection.release();
    }
  }
};

const login = async (req, res) => {

  try {

    const { 
        email, 
        password 
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const [users] = await db.query(
      `
        SELECT id, email, password_hash, role
        FROM users
        WHERE email = ?
      `,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

const logout = async (req, res) => {

  try {

    res.clearCookie("token", { // clear the cookie with the jwt token
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {

    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

const getCurrentUser = async (req, res) => {

  try {

    const userId = req.user.userId;

    const [users] = await db.query(
      `
        SELECT id, email, role, created_at
        FROM users
        WHERE id = ?
      `,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    if (user.role === "COMPANY") {

      const [companies] = await db.query(
        `
          SELECT
            id,
            company_name,
            contact_name,
            contact_phone,
            created_at
          FROM companies
          WHERE user_id = ?
        `,
        [userId]
      );

      return res.status(200).json({
        success: true,

        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
        },

        company: companies[0] || null,
      });
    }

    return res.status(200).json({
      success: true,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      },
    });

  } catch (error) {

    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get current user",
    });
  }
};

module.exports = {
  registerCompany,
  login,
  logout,
  getCurrentUser,
};