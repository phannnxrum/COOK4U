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
            'SELECT USERID, EMAIL, PASS, FULLNAME FROM USER WHERE EMAIL = ?', 
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
                fullname: user.FULLNAME
            }
        });
    } catch (error) {
        console.error('Login error:', error); // Log để debug
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};