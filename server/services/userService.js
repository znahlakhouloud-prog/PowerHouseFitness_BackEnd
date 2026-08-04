import bcrypt from "bcrypt";
import { getUserById,changePassword } from "../models/user.js";

export const changePasswordService = async (
    id,
    oldPassword,
    newPassword
) => {

    // 1. Check user exists
    const users = await getUserById(id);

    if (users.length === 0) {
        throw new Error("USER_NOT_FOUND");
    }

    const user = users[0];

    // 2. Verify old password
    const isMatch = await bcrypt.compare(
        oldPassword,
        user.password
    );

    if (!isMatch) {
        throw new Error("INVALID_PASSWORD");
    }

    // 3. Hash new password
    const hashedPassword =
        await bcrypt.hash(newPassword, 10);

    // 4. Update password
    return await changePassword(id, hashedPassword);

};