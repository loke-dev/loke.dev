export function ScrollCue({
  className = '',
  color = 'text-white',
}: {
  className?: string
  color?: string
}) {
  return (
    <div className={`flex justify-center mt-4 mb-8 ${className}`}>
      <div className={`animate-bounce ${color}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  )
}
