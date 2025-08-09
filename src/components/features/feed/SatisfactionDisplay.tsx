import { useStore } from "@/store/useStore";
import { SatisfactionStatus } from "@/types";
import Image from "next/image";

const satisfactionStyles: Record<
  SatisfactionStatus,
  {
    badge: string;
    badgeDark: string;
    text: string;
    emoji: string;
  }
> = {
  awesome: {
    badge: "bg-yellow-100 text-yellow-800",
    badgeDark: "bg-yellow-900/50 text-yellow-300",
    text: "خوشمزه",
    emoji: "/awesome.png",
  },
  good: {
    badge: "bg-green-100 text-green-800",
    badgeDark: "bg-green-900/50 text-green-300",
    text: "خوب",
    emoji: "/good.png",
  },
  bad: {
    badge: "bg-red-100 text-red-800",
    badgeDark: "bg-red-900/50 text-red-300",
    text: "بد",
    emoji: "/bad.png",
  },
  disgusted: {
    badge: "bg-purple-100 text-purple-800",
    badgeDark: "bg-purple-900/50 text-purple-300",
    text: "افتضاح",
    emoji: "/disgusted.png",
  },
};
export const SatisfactionDisplay = ({
  satisfaction,
}: {
  satisfaction: SatisfactionStatus;
}) => {
  const { theme } = useStore();
  const styles = satisfactionStyles[satisfaction] || satisfactionStyles.good;

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
        theme === "dark" ? styles.badgeDark : styles.badge
      }`}
    >
      <Image src={styles.emoji} alt={satisfaction} width={16} height={16} />
      <span>{styles.text}</span>
    </div>
  );
};
