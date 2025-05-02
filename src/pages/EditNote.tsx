
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotes, Note } from "@/context/notes-context";
import AppLayout from "@/components/layouts/app-layout";
import NoteEditor from "@/components/note-editor";
import { Loader2 } from "lucide-react";

const EditNote = () => {
  const { id } = useParams<{ id: string }>();
  const { notes } = useNotes();
  const [note, setNote] = useState<Note | undefined>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const foundNote = notes.find(n => n.id === id);
    if (foundNote) {
      setNote(foundNote);
    } else {
      navigate("/");
    }
    setLoading(false);
  }, [id, notes, navigate]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {note && <NoteEditor note={note} />}
    </AppLayout>
  );
};

export default EditNote;
