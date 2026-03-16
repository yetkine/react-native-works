export function getFirebaseAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Bu e-posta zaten kullanılıyor.';
    case 'auth/invalid-email':
      return 'Geçerli bir e-posta adresi girin.';
    case 'auth/weak-password':
      return 'Şifre en az 6 karakter olmalıdır.';
    case 'auth/user-not-found':
      return 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.';
    case 'auth/wrong-password':
      return 'Şifre hatalı.';
    case 'auth/invalid-credential':
      return 'E-posta veya şifre hatalı.';
    case 'auth/missing-password':
      return 'Şifre alanı boş bırakılamaz.';
    case 'auth/network-request-failed':
      return 'İnternet bağlantınızı kontrol edin.';
    default:
      return 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.';
  }
}