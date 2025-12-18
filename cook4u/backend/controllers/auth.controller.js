import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Register Controller
export const register = async (req, res) => {
    const { email, password, fullname, phonenumber } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Kiểm tra tồn tại user
        const [existingUser] = await conn.query('SELECT * FROM USER WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User này đã tồn tại' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user mới
        const creation_date = new Date();
        const avturl = 'default_avatar_url';
        const [result] = await conn.query(
            'INSERT INTO USER (email, pass, fullname, creationdate, avturl) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, fullname, creation_date, avturl]
        );

        const [rows] = await conn.query('SELECT USERID FROM USER WHERE EMAIL = ?', [email]);
        const userId = rows[0].USERID;

        // Insert vào customer
        await conn.query(
            'INSERT INTO CUSTOMER (CUSTOMERID, INTRODUCTION, PHONENUMBER, ADDRESS) VALUES (?, ?, ?, ?)',
            [userId, null, phonenumber, null,]
        );

        await conn.commit();
        res.status(201).json({
            message: 'User registered successfully', userId
        });
    } catch (error) {
        await conn.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

// Login Controller
export const login = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập email và password' });
        }

        // Find user - QUAN TRỌNG: Chọn tất cả cột và dùng chữ HOA
        const [users] = await conn.query(
            'SELECT USERID, EMAIL, PASS, FULLNAME, ISADMIN FROM USER WHERE EMAIL = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const user = users[0];

        // Debug log - XÓA SAU KHI FIX
        console.log('User from DB:', user);
        console.log('Password from request:', password);
        console.log('Hashed password from DB:', user.PASS);

        // Compare password - CHÚ Ý: Dùng user.PASS (chữ HOA)
        const isPasswordValid = await bcrypt.compare(password, user.PASS);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.USERID,
                email: user.EMAIL
            },
            process.env.JWT_SECRET || 'your-secret-key-change-this', // Fallback nếu không có env
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Đăng nhập thành công',
            token,
            user: {
                id: user.USERID,
                email: user.EMAIL,
                fullname: user.FULLNAME,
                isAdmin: user.ISADMIN
            }
        });
    } catch (error) {
        console.error('Login error:', error); // Log để debug
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

// Hidden Admin Register Controller
export const adminRegister = async (req, res) => {
    const { email, password, fullname } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        // Kiểm tra tồn tại user
        const [existingUser] = await conn.query('SELECT * FROM USER WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User này đã tồn tại' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert user mới với isAdmin = true
        const creation_date = new Date();
        const avturl = 'default_avatar_url';
        const [result] = await conn.query(
            'INSERT INTO USER (email, pass, fullname, creationdate, avturl, isAdmin) VALUES (?, ?, ?, ?, ?, ?)',
            [email, hashedPassword, fullname, creation_date, avturl, true]
        );
        await conn.commit();
        res.status(201).json({
            message: 'Admin user registered successfully'
        });
    } catch (error) {
        await conn.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

export const checkAccount = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { email } = req.body;
        console.log('Check account - received email:', email);
        console.log('Check account - req.body:', req.body);

        if (!email) {
            return res.status(400).json({ message: 'Vui lòng nhập email' });
        }

        // Tim email co san khong
        const [users] = await conn.query(
            'SELECT USERID, EMAIL, FULLNAME FROM USER WHERE EMAIL = ?',
            [email]
        );
        console.log('Check account - found users:', users);

        if (users.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này' });
        }

        const user = users[0];
        res.status(200).json({
            message: 'Tài khoản tồn tại',
            userId: user.USERID,
            email: user.EMAIL,
            fullname: user.FULLNAME
        });
    } catch (error) {
        console.error('Check account error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { userId, newPassword } = req.body;

        if (!userId || !newPassword) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
        }

        // Hash password moi
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        const [result] = await conn.query(
            'UPDATE USER SET PASS = ? WHERE USERID = ?',
            [hashedPassword, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
        }

        res.status(200).json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

// Login with admin privileges
export const adminLogin = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập email và password' });
        }
        // Find user
        const [users] = await conn.query(
            'SELECT USERID, EMAIL, PASS, FULLNAME, ISADMIN FROM USER WHERE EMAIL = ?',
            [email]
        );
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
        const user = users[0];
        // Check if user is admin
        if (!user.ISADMIN) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập admin' });
        }
        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.PASS);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.USERID,
                email: user.EMAIL,
                isAdmin: user.ISADMIN
            },
            process.env.JWT_SECRET || 'your-secret-key-change-this', // Fallback nếu không có env
            { expiresIn: '24h' }
        );
        res.status(200).json({
            message: 'Đăng nhập admin thành công',
            token,
            user: {
                id: user.USERID,
                email: user.EMAIL,
                fullname: user.FULLNAME,
                isAdmin: user.ISADMIN
            }
        });
    } catch (error) {
        console.error('Admin login error:', error); // Log để debug
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};