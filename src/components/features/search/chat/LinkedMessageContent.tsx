import { useStore } from "@/store/useStore";
import { Poi } from "@/types";

interface LinkedMessageContentProps {
  text: string;
  places: Poi[];
  onPlaceClick: (place: Poi) => void;
}

export const LinkedMessageContent = ({
  text,
  places,
  onPlaceClick,
}: LinkedMessageContentProps) => {
  const { setFeedFlyToCoords } = useStore();

  if (!places || places.length === 0) {
    return (
      <p className="text-sm leading-relaxed text-right" dir="rtl">
        {text}
      </p>
    );
  }

  // 1. Create a regex to find all occurrences of any place name.
  const placeNames = places.map((p) => p.name).filter(Boolean) as string[];
  const escapedPlaceNames = placeNames.map((name) =>
    name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const regex = new RegExp(`(${escapedPlaceNames.join("|")})`, "g");

  // 2. Find all matches and their positions in the text using matchAll.
  const matches = Array.from(text.matchAll(regex));
  const content: React.ReactNode[] = [];
  let lastIndex = 0;

  // 3. Reconstruct the content, replacing matches with buttons while preserving order.
  matches.forEach((match, index) => {
    const placeName = match[0];
    const startIndex = match.index || 0;

    // Add the plain text segment before this match
    if (startIndex > lastIndex) {
      content.push(text.substring(lastIndex, startIndex));
    }

    // Find the corresponding place object for the matched name
    const matchedPlace = places.find((p) => p.name === placeName);

    // Add the clickable button for the matched place
    if (matchedPlace) {
      content.push(
        <button
          key={`${index}-${placeName}`}
          onClick={() => {
            const coords: [number, number] = matchedPlace.position
              ? [matchedPlace.position[1], matchedPlace.position[0]]
              : [matchedPlace.lat, matchedPlace.lon];
            setFeedFlyToCoords(coords);
            onPlaceClick(matchedPlace);
          }}
          className="font-semibold text-blue-400 hover:underline mx-1"
        >
          {placeName}
        </button>
      );
    }

    lastIndex = startIndex + placeName.length;
  });

  // Add any remaining plain text after the last match
  if (lastIndex < text.length) {
    content.push(text.substring(lastIndex));
  }

  return (
    <p className="text-sm leading-relaxed text-right" dir="rtl">
      {content}
    </p>
  );
};
