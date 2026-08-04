import db from "../config/database.js";

// GET ALL USERS
export const getAllUsers = async () => {

    const sql = `
        SELECT
            id,
            user_name,
            age,
            email,
            role
        FROM user
    `;

    const [rows] = await db.query(sql);

    return rows;
};


// GET USER BY ID
export const getUserById = async (id) => {

    const sql = `
        SELECT
            id,
            user_name,
            age,
            email,
            password,
            role,
            must_change_password
        FROM user
        WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;
};

// GET USER BY EMAIL
export const getUserByEmail = async (email) => {

    const sql = `
        SELECT
            id,
            user_name,
            age,
            email,
            password,
            role,
            must_change_password
        FROM user
        WHERE email = ?
    `;

    const [rows] = await db.query(sql, [email]);

    return rows;
};

// CREATE USER
export const createUser = async (data) => {

    const sql = `
        INSERT INTO user
        (
            user_name,
            age,
            email,
            password,
            role,
            must_change_password
        )
        VALUES (?, ?, ?, ?, ?, 1)
    `;

    const [result] = await db.query(sql, [
        data.user_name,
        data.age,
        data.email,
        data.password,
        data.role
    ]);

    return result;
};

// UPDATE USER
export const updateUser = async (id, data) => {

    const sql = `
        UPDATE user
        SET
            user_name = ?,
            age = ?,
            email = ?,
            role = ?
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [
        data.user_name,
        data.age,
        data.email,
        data.role,
        id
    ]);

    return result;
};

// DELETE USER
export const deleteUser = async (id) => {

    const sql = `
        DELETE FROM user
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    return result;
};

// CHECK USER EXISTS
export const userExists = async (id) => {

    const sql = `
        SELECT id
        FROM user
        WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows.length > 0;
};

// CHANGE PASSWORD
export const changePassword = async (id, hashedPassword) => {

    const sql = `
        UPDATE user
        SET
            password = ?,
            must_change_password = 0
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [
        hashedPassword,
        id
    ]);

    return result;
};