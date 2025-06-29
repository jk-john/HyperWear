import { Suspense } from "react";
import UnsubscribeClient from "./UnsubscribeClient";

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <div className="w-full max-w-md rounded-lg bg-white p-10 shadow-md">
            <h1 className="mb-4 text-2xl font-bold">Unsubscribe</h1>
            <p className="text-lg">Processing your request...</p>
          </div>
        </div>
      }
    >
      <UnsubscribeClient />
    </Suspense>
  );
}
