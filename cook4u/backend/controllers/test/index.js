// GET test
export const getTest = (req, res) => {
    res.json({ message: 'Test endpoint is working!' });
};

// POST test
export const postTest = (req, res) => {
    const data = req.body;
    res.json({ message: 'Data received successfully!', data });
};


