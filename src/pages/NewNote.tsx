
import AppLayout from "@/components/layouts/app-layout";
import NoteEditor from "@/components/note-editor";

const NewNote = () => {
  return (
    <AppLayout>
      <NoteEditor isNew />
    </AppLayout>
  );
};

export default NewNote;
