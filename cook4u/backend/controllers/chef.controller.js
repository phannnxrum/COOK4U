import pool from '../config/db.js';

// Controller functions
export const getAllChefs = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const [chefs] = await conn.query(
            'SELECT CHEFID, CHEFNAME, AVTURL, DESCR, EXPYEAR, PRICEPERHOUR, CHEFSTATUS, CREATEDAT FROM CHEF WHERE CHEFSTATUS = TRUE'
        );
        res.status(200).json({ message: 'Chefs retrieved successfully', data: chefs });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

export const getChefbyId = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { id } = req.params;
        const [chefs] = await conn.query(
            'SELECT CHEFID, CHEFNAME, AVTURL, DESCR, CHEFAREA, CHEFTIME, EXPYEAR, PRICEPERHOUR, CHEFSTATUS, CREATEDAT FROM CHEF WHERE CHEFID = ?',
            [id]
        );
        if (chefs.length === 0) {
            return res.status(404).json({ message: 'Chef not found' });
        }
        res.status(200).json({ message: 'Chef retrieved successfully', data: chefs[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

// Hàm convert "" hoặc undefined thành null
const toNull = (value) => {
  return value === "" || value === undefined ? null : value;
};

export const createChef = async (req, res) => {
    const { chefname, avturl, descr, chefarea, cheftime, minhour, expyear, priceperhour } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const [result] = await conn.query(
            `INSERT INTO CHEF 
             (CHEFNAME, AVTURL, DESCR, CHEFAREA, CHEFTIME, MINHOUR, EXPYEAR, PRICEPERHOUR, CHEFSTATUS) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
            [
              toNull(chefname),
              toNull(avturl),
              toNull(descr),
              toNull(chefarea),
              toNull(cheftime),
              toNull(minhour),
              toNull(expyear),
              toNull(priceperhour)
            ]
        );
        await conn.commit();
        // Trả về ID của chef mới tạo trong mysql
        const [rows] = await conn.query( 'SELECT CHEFID FROM CHEF ORDER BY CREATEDAT DESC LIMIT 1' );
        res.status(201).json({ message: 'Chef created successfully', chefId: rows[0].CHEFID });
    } catch (error) {
        await conn.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};


export const updateChef = async (req, res) => {
    const { id } = req.params;
    const { chefname, avturl, descr, chefarea, cheftime, minhour, expyear, priceperhour } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Lấy dữ liệu hiện tại
        const [rows] = await conn.query('SELECT * FROM CHEF WHERE CHEFID = ?', [id]);
        if (rows.length === 0) {
            await conn.rollback();
            return res.status(404).json({ message: 'Chef not found' });
        }
        const currentChef = rows[0];

        // Merge dữ liệu mới với dữ liệu cũ
        const updatedChef = {
            chefname: chefname ?? currentChef.CHEFNAME,
            avturl: avturl ?? currentChef.AVTURL,
            descr: descr ?? currentChef.DESCR,
            chefarea: chefarea ?? currentChef.CHEFAREA,
            cheftime: cheftime ?? currentChef.CHEFTIME,
            minhour: minhour ?? currentChef.MINHOUR,
            expyear: expyear ?? currentChef.EXPYEAR,
            priceperhour: priceperhour ?? currentChef.PRICEPERHOUR,
        };

        // Update
        const [result] = await conn.query(
            'UPDATE CHEF SET CHEFNAME = ?, AVTURL = ?, DESCR = ?, CHEFAREA = ?, CHEFTIME = ?, MINHOUR = ?, EXPYEAR = ?, PRICEPERHOUR = ? WHERE CHEFID = ?',
            [
                updatedChef.chefname,
                updatedChef.avturl,
                updatedChef.descr,
                updatedChef.chefarea,
                updatedChef.cheftime,
                updatedChef.minhour,
                updatedChef.expyear,
                updatedChef.priceperhour,
                id
            ]
        );

        await conn.commit();
        res.status(200).json({ message: 'Chef updated successfully' });
    } catch (error) {
        await conn.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};
