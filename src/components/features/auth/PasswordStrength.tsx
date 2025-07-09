import { CheckCircle2, XCircle } from "lucide-react";

interface PasswordStrengthProps {
  password?: string;
}

const rules = [
  { text: "حداقل ۸ کاراکتر", regex: /.{8,}/ },
  { text: "یک حرف بزرگ انگلیسی", regex: /[A-Z]/ },
  { text: "یک حرف کوچک انگلیسی", regex: /[a-z]/ },
  { text: "یک عدد", regex: /[0-9]/ },
  { text: "یک کاراکتر خاص (!@#...)", regex: /[^a-zA-Z0-9]/ },
];

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password = "",
}) => {
  return (
    <div className="space-y-1 mt-2 text-xs">
      {rules.map((rule) => {
        const isValid = rule.regex.test(password);
        return (
          <div
            key={rule.text}
            className={`flex items-center gap-2 transition-colors ${
              isValid ? "text-[#159c49]" : "text-gray-500"
            }`}
          >
            {isValid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            <span>{rule.text}</span>
          </div>
        );
      })}
    </div>
  );
};
