export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center space-y-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary mx-auto" />
        <div className="text-gray-600 font-medium text-lg">Loading HyperWear...</div>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}