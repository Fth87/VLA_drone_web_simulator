export const AUTH_ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
} as const

export const AUTH_COPY = {
  brand: 'Drone Access',
  loginTitle: 'Login',
  loginDescription: 'Masuk dulu untuk akses halaman simulator.',
  registerTitle: 'Register',
  registerDescription: 'Buat akun baru untuk mulai menggunakan simulator.',
  loginFooter: 'Belum punya akun?',
  registerFooter: 'Sudah punya akun?',
  loginLink: 'Register di sini',
  registerLink: 'Kembali ke login',
  loginLoading: 'Memproses...',
  loginButton: 'Login',
  registerLoading: 'Mendaftar...',
  registerButton: 'Register',
} as const

export const AUTH_VALIDATION = {
  minNameLength: 2,
  minPasswordLength: 8,
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const

export const AUTH_MESSAGES = {
  requiredCredentials: 'Email dan password wajib diisi.',
  invalidName: 'Nama minimal 2 karakter.',
  invalidEmail: 'Format email tidak valid.',
  invalidPassword: 'Password minimal 8 karakter.',
  envMissing:
    'Supabase env belum diatur. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.',
} as const
