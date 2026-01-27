import accessTokenStore from '../store/accessTokenStore';
import {
  getRefreshToken,
  saveRefreshToken,
  clearRefreshToken,
} from '../utils/token';
import { storage } from './storage';

export const API_URL = process.env.API_URL || 'http://192.168.1.73:3000/api/v1';

let isRefreshing = false;
let refreshSubscribers = [];

// ===== helpers =====
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

function createError({ status, code, message, raw }) {
  return { status, code, message, raw };
}

// ===== refresh token =====
async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');

  const res = await fetch(`${API_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: refreshToken }),
  });

  if (!res.ok) throw new Error('REFRESH_FAILED');

  const data = await res.json();

  if (data.data?.refreshToken) {
    storage.set('accessToken', data.data.accessToken);
    await saveRefreshToken(data.data.refreshToken);
  }

  return data.data.accessToken;
}

// ===== MAIN REQUEST =====
export async function request(path, options = {}) {
  try {
    const storedToken = storage.getString('accessToken');
    if(!accessTokenStore.getState()?.accessToken) {
      accessTokenStore.getState().setAccessToken(storedToken);
    }
    const accessToken = accessTokenStore?.getState?.()?.accessToken 

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });

    const data = await res.json();

    // ✅ OK
    if (res.ok) return data;

    // ❌ không phải lỗi access token
    if (
      res.status !== 401 ||
      data?.code !== 'AUTH_ACCESS_TOKEN_INVALID'
    ) {
      throw createError({
        status: res.status,
        code: data?.code || 'UNKNOWN_ERROR',
        message: data?.message || 'Request failed',
        raw: data,
      });
    }

    // ===== 401 → REFRESH =====
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        isRefreshing = false;

        accessTokenStore
          ?.getState?.()
          ?.setAccessToken(newAccessToken);

        onRefreshed(newAccessToken);

        // retry request ban đầu
        return request(path, options);
      } catch (err) {
        isRefreshing = false;
        refreshSubscribers = [];
        accessTokenStore?.getState?.()?.clearAccessToken?.();
        // await clearRefreshToken();

        throw createError({
          status: 401,
          code: 'REFRESH_TOKEN_INVALID',
          message: 'Phiên đăng nhập đã hết hạn',
          raw: err,
        });
      }
    }

    // đang refresh → chờ
    return new Promise((resolve) => {
      subscribeTokenRefresh(() => {
        resolve(request(path, options));
      });
    });
  } catch (err) {
    // 🌐 network error
    if (err instanceof TypeError) {
      throw createError({
        status: 0,
        code: 'NETWORK_ERROR',
        message: 'Không có kết nối mạng',
        raw: err,
      });
    }

    throw err;
  }
}
