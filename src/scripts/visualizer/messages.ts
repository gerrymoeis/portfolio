import { getCurrentLanguage } from '../language';

const MESSAGES = {
  en: {
    alreadyRunning: 'Visualizer is already running',
    requesting: 'Requesting tab audio capture... Please select "This Tab" and check "Share audio"',
    requestingMic: 'Requesting microphone access... Please allow microphone permission.',
    audioCaptured: 'Audio captured! Initializing visualizer...',
    micGranted: 'Microphone access granted! Initializing visualizer...',
    visualizing: 'Visualizing! The visualizer is now synced with the audio.',
    screenSharingStopped: 'Screen sharing stopped by user',
    micStopped: 'Microphone access stopped',
    waiting: 'Waiting for music...',
    stopped: 'Visualizer stopped. Click "Start Visualizer" to begin again.',
    permissionDenied: 'Permission denied. Please allow screen sharing and make sure to check "Share audio".',
    micPermissionDenied: 'Microphone permission denied. Please allow microphone access in your browser settings.',
    noAudioTrack: 'No audio track found! Make sure to check "Share audio" in the browser prompt.',
    noAudioSource: 'No audio source found. Make sure audio is available.',
    notSupported: 'This feature is not supported on your device/browser.',
    failed: 'Failed to start visualizer: ',
  },
  id: {
    alreadyRunning: 'Visualizer sudah berjalan',
    requesting: 'Meminta izin tangkapan audio tab... Silakan pilih "This Tab" dan centang "Share audio"',
    requestingMic: 'Meminta izin akses mikrofon... Harap izinkan akses mikrofon.',
    audioCaptured: 'Audio berhasil ditangkap! Menginisialisasi visualizer...',
    micGranted: 'Akses mikrofon diberikan! Menginisialisasi visualizer...',
    visualizing: 'Memvisualisasikan! Visualizer sekarang tersinkronisasi dengan audio.',
    screenSharingStopped: 'Berbagi layar dihentikan oleh pengguna',
    micStopped: 'Akses mikrofon dihentikan',
    waiting: 'Menunggu musik...',
    stopped: 'Visualizer dihentikan. Klik "Mulai Visualizer" untuk memulai lagi.',
    permissionDenied: 'Izin ditolak. Harap izinkan berbagi layar dan pastikan untuk mencentang "Share audio".',
    micPermissionDenied: 'Izin mikrofon ditolak. Harap izinkan akses mikrofon di pengaturan browser Anda.',
    noAudioTrack: 'Track audio tidak ditemukan! Pastikan untuk mencentang "Share audio" di prompt browser.',
    noAudioSource: 'Sumber audio tidak ditemukan. Pastikan audio tersedia.',
    notSupported: 'Fitur ini tidak didukung di perangkat/browser Anda.',
    failed: 'Gagal memulai visualizer: ',
  }
};

export type MessageKey = keyof typeof MESSAGES.en;

export function getMessage(key: MessageKey): string {
  const lang = getCurrentLanguage();
  return MESSAGES[lang][key];
}
