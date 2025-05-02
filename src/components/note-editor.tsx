import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNotes, Note } from "@/context/notes-context";
import TagInput from "@/components/tag-input";
import { useNavigate } from "react-router-dom";
import { Loader2, Save, ArrowLeft } from "lucide-react";

interface NoteEditorProps {
  note?: Note;
  isNew?: boolean;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, isNew = false }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [saving, setSaving] = useState(false);
  const { createNote, updateNote } = useNotes();
  const navigate = useNavigate();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    try {
      setSaving(true);
      
      if (isNew) {
        const noteId = await createNote({
          title: title.trim(),
          content,
          tags,
        });
        navigate(`/note/${noteId}`);
      } else if (note) {
        await updateNote(note.id, {
          title: title.trim(),
          content,
          tags,
        });
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={20} />
        </Button>
        
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="text-2xl font-bold px-0 border-none shadow-none focus-visible:ring-0 h-auto"
        />
        
        <Button
          onClick={handleSave}
          disabled={saving || !title.trim()}
        >
          {saving ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save
            </>
          )}
        </Button>
      </div>

      <TagInput tags={tags} onChange={setTags} />
      
      <div className="min-h-[400px]">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder="Write something amazing..."
        />
      </div>
    </div>
  );
};

export default NoteEditor;
