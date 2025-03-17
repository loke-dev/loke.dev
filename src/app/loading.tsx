export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
