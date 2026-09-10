const db = require("../config/database");

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.promise().query(`
            SELECT
                c.category_id,
                c.organization_id,
                c.name,
                c.description,
                o.name AS organization_name
            FROM categories c
            JOIN organizations o
                ON c.organization_id = o.organization_id
            ORDER BY c.category_id DESC
        `);

        res.json({
            success: true,
            categories
        });
    } catch (error) {
        console.error("Get categories error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch categories."
        });
    }
};


// Get one category
exports.getCategory = async (req, res) => {
    try {
        const [categories] = await db.promise().query(`
            SELECT
                c.category_id,
                c.organization_id,
                c.name,
                c.description,
                o.name AS organization_name
            FROM categories c
            JOIN organizations o
                ON c.organization_id = o.organization_id
            WHERE c.category_id = ?
        `, [req.params.id]);

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        res.json({
            success: true,
            category: categories[0]
        });
    } catch (error) {
        console.error("Get category error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch category."
        });
    }
};


// Create category
exports.createCategory = async (req, res) => {
    try {
        const {
            organization_id,
            name,
            description
        } = req.body;

        if (!organization_id || !name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Organization and category name are required."
            });
        }

        const [result] = await db.promise().query(`
            INSERT INTO categories
            (organization_id, name, description)
            VALUES (?, ?, ?)
        `, [
            organization_id,
            name.trim(),
            description?.trim() || null
        ]);

        const [categories] = await db.promise().query(`
            SELECT
                c.category_id,
                c.organization_id,
                c.name,
                c.description,
                o.name AS organization_name
            FROM categories c
            JOIN organizations o
                ON c.organization_id = o.organization_id
            WHERE c.category_id = ?
        `, [result.insertId]);

        res.status(201).json({
            success: true,
            message: "Category created successfully.",
            category: categories[0]
        });
    } catch (error) {
        console.error("Create category error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create category."
        });
    }
};


// Update category
exports.updateCategory = async (req, res) => {
    try {
        const {
            organization_id,
            name,
            description
        } = req.body;

        if (!organization_id || !name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Organization and category name are required."
            });
        }

        const [result] = await db.promise().query(`
            UPDATE categories
            SET
                organization_id = ?,
                name = ?,
                description = ?
            WHERE category_id = ?
        `, [
            organization_id,
            name.trim(),
            description?.trim() || null,
            req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        res.json({
            success: true,
            message: "Category updated successfully."
        });
    } catch (error) {
        console.error("Update category error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update category."
        });
    }
};


// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const [result] = await db.promise().query(
            "DELETE FROM categories WHERE category_id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        res.json({
            success: true,
            message: "Category deleted successfully."
        });
    } catch (error) {
        console.error("Delete category error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete category."
        });
    }
};