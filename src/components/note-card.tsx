
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Trash2, Pin, Edit } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotes, Note } from "@/context/notes-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteNote, togglePinStatus } = useNotes();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/note/${note.id}`);
  };

  const handlePin = async () => {
    await togglePinStatus(note.id, !note.isPinned);
  };

  const handleDelete = async () => {
    await deleteNote(note.id);
    setShowDeleteDialog(false);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, "MMM d, yyyy");
  };

  // Function to safely extract plain text from HTML content
  const getContentPreview = (htmlContent: string) => {
    // Create a temporary div to parse the HTML
    const temp = document.createElement("div");
    temp.innerHTML = htmlContent;
    const text = temp.textContent || temp.innerText || "";
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
  };

  return (
    <>
      <Card className={`h-full flex flex-col hover:shadow-md transition-shadow ${note.isPinned ? "border-primary" : ""}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-semibold line-clamp-2">
              {note.title}
            </CardTitle>
            {note.isPinned && <Pin size={16} className="text-primary" />}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {note.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="pb-2 pt-0 flex-grow">
          <div className="text-sm text-muted-foreground line-clamp-4 note-content">
            {getContentPreview(note.content)}
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 flex items-center justify-between border-t">
          <div className="text-xs text-muted-foreground">
            {formatDate(note.updatedAt)}
          </div>
          
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={handlePin} title={note.isPinned ? "Unpin" : "Pin"}>
              <Pin size={16} className={note.isPinned ? "text-primary" : ""} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Edit size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 size={16} />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the note "{note.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NoteCard;
