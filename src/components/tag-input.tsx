
import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange, className }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue("");
    }
  };
  
  const addTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onChange([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={cn("flex flex-wrap gap-2 items-center", className)}>
      {tags.map(tag => (
        <Badge key={tag} variant="secondary" className="px-2 py-1">
          {tag}
          <X
            size={14}
            className="ml-1 cursor-pointer"
            onClick={() => removeTag(tag)}
          />
        </Badge>
      ))}
      
      <div className="flex">
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tag..."
          className="h-8 min-w-[120px] max-w-[200px]"
        />
        {inputValue && (
          <span 
            className="ml-1 p-1 cursor-pointer hover:bg-muted rounded-md"
            onClick={addTag}
          >
            <Plus size={16} />
          </span>
        )}
      </div>
    </div>
  );
};

export default TagInput;
