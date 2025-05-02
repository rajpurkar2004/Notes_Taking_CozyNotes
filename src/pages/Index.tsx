
import { Suspense } from "react";
import AppLayout from "@/components/layouts/app-layout";
import { useNotes } from "@/context/notes-context";
import NoteCard from "@/components/note-card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Loader2 } from "lucide-react";

const Index = () => {
  const { filteredNotes, loading, searchTerm, activeTag } = useNotes();
  const navigate = useNavigate();
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading notes...</p>
        </div>
      );
    }

    if (filteredNotes.length === 0) {
      return (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">No notes found</h2>
          
          {searchTerm || activeTag ? (
            <p className="text-muted-foreground">
              {searchTerm && !activeTag && `No results for "${searchTerm}"`}
              {!searchTerm && activeTag && `No notes with tag "${activeTag}"`}
              {searchTerm && activeTag && `No results for "${searchTerm}" with tag "${activeTag}"`}
            </p>
          ) : (
            <div className="mt-6">
              <p className="text-muted-foreground mb-4">
                Create your first note to get started
              </p>
              <Button onClick={() => navigate("/new")}>
                <PlusCircle size={16} className="mr-2" />
                Create New Note
              </Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <Suspense key={note.id} fallback={<div className="h-48 animate-pulse bg-muted rounded-md"></div>}>
            <NoteCard note={note} />
          </Suspense>
        ))}
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {activeTag ? `Notes tagged "${activeTag}"` : "All Notes"}
          </h1>
          {searchTerm && (
            <p className="text-muted-foreground">
              Search results for "{searchTerm}"
            </p>
          )}
        </div>
        
        <Button onClick={() => navigate("/new")}>
          <PlusCircle size={16} className="mr-2" />
          New Note
        </Button>
      </div>
      
      {renderContent()}
    </AppLayout>
  );
};

export default Index;
