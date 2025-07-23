export type BannerProps = {
  type: 'success' | 'danger' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
};