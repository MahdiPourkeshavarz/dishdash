import L from "leaflet";
import { Marker } from "react-leaflet";
import { renderToString } from "react-dom/server";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { HighlightLabel } from "./HighlightLabel";

interface HighlightMarkerProps {
  position: [number, number];
  name: string;
}

export const HighlightMarker: React.FC<HighlightMarkerProps> = ({
  position,
  name,
}) => {
  const { setHighlightedPoi } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setHighlightedPoi(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [setHighlightedPoi]);

  const customIcon = L.divIcon({
    html: renderToString(<HighlightLabel name={name} />),
    className: "bg-transparent border-none",
    iconAnchor: [0, 0],
  });

  return <Marker position={position} icon={customIcon} interactive={false} />;
};
