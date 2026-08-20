import db from "../config/database.js";


// ============================================
// GET ALL USERS
// ============================================

export const getAllUsers = async () => {

    const sql = `
        SELECT
            id,
            user_name,
            birth_date,
            email,
            role
        FROM user
    `;

    const [rows] = await db.query(sql);

    return rows;
};


// ============================================
// GET USER BY ID
// ============================================

export const getUserById = async (id) => {

    const sql = `
        SELECT
            id,
            user_name,
            birth_date,
            email,
            password,
            role,
            must_change_password
        FROM user
        WHERE id = ?
    `;

    const [rows] = await db.query(
        sql,
        [id]
    );

    return rows;
};


// ============================================
// GET USER BY EMAIL
// ============================================

export const getUserByEmail = async (email) => {

    const sql = `
        SELECT
            id,
            user_name,
            birth_date,
            email,
            password,
            role,
            must_change_password,
            reset_password_token,
            reset_password_expires
        FROM user
        WHERE email = ?
    `;

    const [rows] = await db.query(
        sql,
        [email]
    );

    return rows;
};


// ============================================
// CREATE USER
// ============================================

export const createUser = async (data) => {

    const sql = `
        INSERT INTO user
        (
            user_name,
            birth_date,
            email,
            password,
            role,
            must_change_password
        )
        VALUES (?, ?, ?, ?, ?, 1)
    `;

    const [result] = await db.query(
        sql,
        [
            data.user_name,
            data.birth_date,
            data.email,
            data.password,
            data.role
        ]
    );

    return result;
};


// ============================================
// UPDATE USER
// ============================================

export const updateUser = async (id, data) => {

    const sql = `
        UPDATE user
        SET
            user_name = ?,
            birth_date = ?,
            email = ?,
            role = ?
        WHERE id = ?
    `;

    const [result] = await db.query(
        sql,
        [
            data.user_name,
            data.birth_date,
            data.email,
            data.role,
            id
        ]
    );

    return result;
};


// ============================================
// DELETE USER
// ============================================

export const deleteUser = async (id) => {

    const sql = `
        DELETE FROM user
        WHERE id = ?
    `;

    const [result] = await db.query(
        sql,
        [id]
    );

    return result;
};


// ============================================
// GET ADMIN USER IDS (for fanning out admin-facing notifications)
// ============================================

export const getAdminUserIds = async () => {

    const sql = `
        SELECT id
        FROM user
        WHERE role = 'admin'
    `;

    const [rows] = await db.query(sql);

    return rows.map((row) => row.id);
};


// ============================================
// CHECK USER EXISTS
// ============================================

export const userExists = async (id) => {

    const sql = `
        SELECT id
        FROM user
        WHERE id = ?
    `;

    const [rows] = await db.query(
        sql,
        [id]
    );

    return rows.length > 0;
};


// ============================================
// CHANGE PASSWORD
// ============================================

export const changePassword = async (
    id,
    hashedPassword
) => {

    const sql = `
        UPDATE user
        SET
            password = ?,
            must_change_password = 0
        WHERE id = ?
    `;

    const [result] = await db.query(
        sql,
        [
            hashedPassword,
            id
        ]
    );

    return result;
};


// ============================================
// SAVE RESET TOKEN
// ============================================

export const saveResetToken = async (
    id,
    hashedToken,
    expires
) => {

    const sql = `
        UPDATE user
        SET
            reset_password_token = ?,
            reset_password_expires = ?
        WHERE id = ?
    `;

    const [result] = await db.query(
        sql,
        [
            hashedToken,
            expires,
            id
        ]
    );

    return result;
};


// ============================================
// GET USER BY RESET TOKEN
// ============================================

export const getUserByResetToken = async (
    hashedToken
) => {

    const sql = `
        SELECT
            id,
            email
        FROM user
        WHERE reset_password_token = ?
        AND reset_password_expires > NOW()
    `;

    const [rows] = await db.query(
        sql,
        [hashedToken]
    );

    return rows;
};


// ============================================
// CLEAR RESET TOKEN
// ============================================

export const clearResetToken = async (id) => {

    const sql = `
        UPDATE user
        SET
            reset_password_token = NULL,
            reset_password_expires = NULL
        WHERE id = ?
    `;

    const [result] = await db.query(
        sql,
        [id]
    );

    return result;
};


// ============================================
// UPDATE PASSWORD
// ============================================

export const updatePassword = async (
    id,
    hashedPassword
) => {

    const sql = `
        UPDATE user
        SET
            password = ?,
            must_change_password = 0
        WHERE id = ?
    `;

    const [result] = await db.query(
        sql,
        [
            hashedPassword,
            id
        ]
    );

    return result;
};