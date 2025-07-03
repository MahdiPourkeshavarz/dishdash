import { MapPin } from "lucide-react";

export function MapLoader() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 rounded-full bg-brand-primary/30 animate-ping"></div>

        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary">
          <MapPin className="h-6 w-6 text-black" />
        </div>
      </div>
      <p className="mt-4 text-lg font-semibold text-slate-600">
        Loading Map...
      </p>
      {/* <Image
        src={"/dots-loading.git"}
        alt="Map is Loading ..."
        width={80}
        height={80}
      /> */}
    </div>
  );
}
