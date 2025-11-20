"use server"
const { signOut } = require("@/auth");


export const logout = async () => {
    await signOut();
}