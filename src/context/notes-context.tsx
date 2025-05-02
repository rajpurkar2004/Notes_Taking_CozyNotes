
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './auth-context';
import { toast } from "sonner";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isPinned: boolean;
  userId: string;
}

interface CreateNoteData {
  title: string;
  content: string;
  tags: string[];
  isPinned?: boolean;
}

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  filteredNotes: Note[];
  searchTerm: string;
  activeTag: string | null;
  createNote: (data: CreateNoteData) => Promise<string>;
  updateNote: (id: string, data: Partial<CreateNoteData>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePinStatus: (id: string, isPinned: boolean) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setActiveTag: (tag: string | null) => void;
  getAllTags: () => string[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Filtered notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = activeTag ? note.tags.includes(activeTag) : true;
    return matchesSearch && matchesTag;
  });

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      if (!currentUser) {
        setNotes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const q = query(
          collection(db, 'notes'), 
          where('userId', '==', currentUser.uid),
          orderBy('isPinned', 'desc'),
          orderBy('updatedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const notesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Note[];
        
        setNotes(notesData);
      } catch (error: any) {
        toast.error(`Error fetching notes: ${error.message}`);
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [currentUser]);

  const createNote = async (data: CreateNoteData) => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const noteData = {
        ...data,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPinned: data.isPinned || false
      };

      const docRef = await addDoc(collection(db, 'notes'), noteData);
      
      // Optimistically update local state
      const newNote = {
        id: docRef.id,
        ...noteData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      } as Note;
      
      setNotes(prev => [newNote, ...prev]);
      toast.success("Note created successfully");
      return docRef.id;
    } catch (error: any) {
      toast.error(`Failed to create note: ${error.message}`);
      throw error;
    }
  };

  const updateNote = async (id: string, data: Partial<CreateNoteData>) => {
    try {
      const noteRef = doc(db, 'notes', id);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(noteRef, updateData);
      
      // Optimistically update local state
      setNotes(prev => 
        prev.map(note => 
          note.id === id 
            ? { ...note, ...data, updatedAt: Timestamp.now() } 
            : note
        )
      );
      
      toast.success("Note updated successfully");
    } catch (error: any) {
      toast.error(`Failed to update note: ${error.message}`);
      throw error;
    }
  };

  const togglePinStatus = async (id: string, isPinned: boolean) => {
    try {
      const noteRef = doc(db, 'notes', id);
      await updateDoc(noteRef, { 
        isPinned,
        updatedAt: serverTimestamp()
      });
      
      // Optimistically update local state
      setNotes(prev => 
        prev.map(note => 
          note.id === id 
            ? { ...note, isPinned, updatedAt: Timestamp.now() } 
            : note
        )
      );
      
      toast.success(`Note ${isPinned ? 'pinned' : 'unpinned'}`);
    } catch (error: any) {
      toast.error(`Failed to ${isPinned ? 'pin' : 'unpin'} note: ${error.message}`);
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
      
      // Update local state
      setNotes(prev => prev.filter(note => note.id !== id));
      
      toast.success("Note deleted");
    } catch (error: any) {
      toast.error(`Failed to delete note: ${error.message}`);
      throw error;
    }
  };

  const getAllTags = () => {
    const tagsSet = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  };

  const value = {
    notes,
    loading,
    filteredNotes,
    searchTerm,
    activeTag,
    createNote,
    updateNote,
    deleteNote,
    togglePinStatus,
    setSearchTerm,
    setActiveTag,
    getAllTags,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};
