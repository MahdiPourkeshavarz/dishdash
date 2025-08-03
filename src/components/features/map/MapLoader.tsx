"use client";

import { SpinnerIcon } from "@/components/layout/SpinnerIcon";

export const MapLoader: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-black/25">
      <div className="flex w-full max-w-xs flex-col items-center justify-center rounded-2xl bg-white/10 p-8 backdrop-blur-xl">
        <SpinnerIcon className="h-12 w-12 text-white/80" />
        <p className="mt-5 text-base font-medium text-white">
          در حال بارگذاری نقشه...
        </p>
      </div>
    </div>
  );
};
