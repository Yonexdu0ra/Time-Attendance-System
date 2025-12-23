import * as Keychain from "react-native-keychain";
/* ===== KEYCHAIN ===== */
const REFRESH_KEY = process.env.REFRESH_TOKEN_KEY_NAME || "REFRESH_TOKEN";

export async function getRefreshToken() {
  const res = await Keychain.getGenericPassword();
  return res ? res.password : null;
}

export async function saveRefreshToken(token) {
  await Keychain.setGenericPassword(REFRESH_KEY, token);
}

export async function clearRefreshToken() {
  await Keychain.resetGenericPassword();
}
