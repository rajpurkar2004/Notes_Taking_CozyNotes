
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  PlusCircle, 
  Tag, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/context/notes-context";
import { Badge } from "@/components/ui/badge";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    setSearchTerm, 
    searchTerm, 
    getAllTags, 
    activeTag, 
    setActiveTag
  } = useNotes();
  
  const tags = getAllTags();

  const NavItem = ({ 
    icon: Icon, 
    label, 
    to, 
    active = false, 
    onClick 
  }: { 
    icon: React.ElementType; 
    label: string; 
    to?: string; 
    active?: boolean;
    onClick?: () => void;
  }) => {
    const handleClick = () => {
      if (onClick) {
        onClick();
      } else if (to) {
        navigate(to);
      }
    };

    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3",
          active && "bg-accent text-accent-foreground"
        )}
        onClick={handleClick}
      >
        <Icon size={18} />
        {!collapsed && <span>{label}</span>}
      </Button>
    );
  };

  return (
    <div 
      className={cn(
        "h-screen bg-sidebar border-r transition-all duration-300 flex flex-col",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <div className="p-4 flex justify-between items-center border-b">
        {!collapsed && <span className="font-semibold">Menu</span>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(prev => !prev)}
          className={cn(collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <div className="flex-1 py-2 overflow-y-auto">
        <div className="px-2 space-y-1">
          <NavItem 
            icon={Home} 
            label="All Notes" 
            to="/" 
            active={location.pathname === "/" && !activeTag} 
            onClick={() => setActiveTag(null)}
          />
          
          <NavItem 
            icon={PlusCircle} 
            label="New Note" 
            to="/new"
            active={location.pathname === "/new"} 
          />
          
          <NavItem 
            icon={Search} 
            label="Search" 
            onClick={() => setShowSearch(!showSearch)} 
          />
          
          {showSearch && !collapsed && (
            <div className="px-2 pb-2">
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
              />
            </div>
          )}
        </div>
        
        {!collapsed && tags.length > 0 && (
          <div className="mt-4">
            <div className="px-4 mb-2 flex items-center">
              <Tag size={16} className="mr-2" />
              <span className="text-sm font-medium">Tags</span>
            </div>
            <div className="px-2 space-y-1">
              {tags.map(tag => (
                <Badge 
                  key={tag}
                  variant={activeTag === tag ? "default" : "outline"}
                  className={cn(
                    "mr-1 mb-1 cursor-pointer",
                    activeTag === tag ? "bg-primary" : "hover:bg-secondary"
                  )}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                >
                  {tag}
                  {activeTag === tag && (
                    <X size={14} className="ml-1" onClick={(e) => {
                      e.stopPropagation();
                      setActiveTag(null);
                    }} />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
