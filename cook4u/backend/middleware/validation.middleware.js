const validateRegister = (req, res, next) => {
    const { email, password, confirmPassword, name } = req.body;

    if (!email || !password || !confirmPassword || !name) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    next();
};

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Here you would typically verify the token (e.g., using JWT)
    // For example:
    // jwt.verify(token, secretKey, (err, decoded) => {
    //     if (err) {
    //         return res.status(401).json({ message: "Unauthorized" });
    //     }
    //     req.userId = decoded.id; // Assuming the token contains the user ID
    //     next();
    // });

    next(); // Remove this line if you implement token verification
};
