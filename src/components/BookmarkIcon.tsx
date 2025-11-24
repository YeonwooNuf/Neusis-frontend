type BookmarkIconProps = {
  filled: boolean;
  size?: number; // 선택: 사이즈도 유연하게
};

const BookmarkIcon = ({ filled, size = 20 }: BookmarkIconProps) => (
  filled ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#f6c343">
      <path d="M6 2a2 2 0 0 0-2 2v17.586a1 1 0 0 0 1.707.707L12 17.414l6.293 5.879A1 1 0 0 0 20 21.586V4a2 2 0 0 0-2-2H6z" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2">
      <path d="M6 2h12a2 2 0 0 1 2 2v17.586a1 1 0 0 1-1.707.707L12 17.414l-6.293 5.879A1 1 0 0 1 4 21.586V4a2 2 0 0 1 2-2z" />
    </svg>
  )
);

export default BookmarkIcon;