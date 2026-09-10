const db = require("../config/database");

exports.getUsers = async (req, res) => {

    try {

        const [users] = await db.promise().query(`
            SELECT
                user_id,
                name,
                email,
                role
            FROM users
            ORDER BY name
        `);


        res.json({
            success: true,
            users
        });

    } catch (error) {

        console.error(
            "Get users error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch users."
        });
    }
};