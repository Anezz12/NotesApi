import './styles/style.css';
import './components/path.js';
import { animate, spring } from 'motion';

// API DICOIDNG & AUTH TOKEN
const API_BASE_URL = 'https://notes-api.dicoding.dev/v2';
const AUTH_TOKEN = '12345';

// Fetch Data Notes
const fetchNotes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`);
    const data = await response.json();
    if (data.error) {
      throw new Error(data.message);
    }
    return data.data;
  } catch (error) {
    showErrorMessage(error.message);
  }
};

// Create Note
const createNote = async (note) => {
  try {
    showFullPageLoading();
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': AUTH_TOKEN,
      },
      body: JSON.stringify({ title: note.title, body: note.body }),
    });
    if (!response.ok) {
      throw new Error('Failed to create note');
    }
    showSuccessMessage('Catatan berhasil ditambahkan!');
    return await fetchNotes();
  } catch (error) {
    showErrorMessage(error.message);
  } finally {
    hideFullPageLoading();
  }
};

// Delete Note
const deleteNote = async (noteId) => {
  try {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Anda tidak akan dapat mengembalikan catatan ini!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });
    if (result.isConfirmed) {
      showFullPageLoading();
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'X-Auth-Token': AUTH_TOKEN,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
      showSuccessMessage('Catatan berhasil dihapus');
      return await fetchNotes();
    }
  } catch (error) {
    showErrorMessage(error.message);
  } finally {
    hideFullPageLoading();
  }
};

// Render Notes
const renderNotes = (notes) => {
  const noteItems = document.querySelectorAll('note-item');
  noteItems.forEach((noteItem) => {
    noteItem.note = notes;
    const shadowRoot = noteItem.shadowRoot;
    const deleteButtons = shadowRoot.querySelectorAll('.button-delete');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const noteId = event.target.dataset.id;
        deleteNote(noteId).then(renderNotes);
      });
    });
  });
};

// Show Message
const showSuccessMessage = (message) => {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
};

// Show Error Message
const showErrorMessage = (message) => {
  Swal.fire({
    title: 'Error',
    text: message,
    icon: 'error',
  });
};

// Full Page Loading
const showFullPageLoading = () => {
  const loadingIndicator = document.getElementById('fullPageLoading');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'flex';
  }
};

// Hide Full Page Loading
const hideFullPageLoading = () => {
  const loadingIndicator = document.getElementById('fullPageLoading');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'none';
  }
};

// Animate Full Page Loading
const initializeApp = async () => {
  showFullPageLoading();
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const notes = await fetchNotes();
    renderNotes(notes);
    const inputNoteElement = document.querySelector('note-input');
    if (inputNoteElement) {
      animate(
        inputNoteElement,
        { opacity: [0, 1], scale: [0.9, 1] },
        { duration: 0.5, easing: spring({ stiffness: 100, damping: 15 }) }
      );

      inputNoteElement.addEventListener('note-added', (event) => {
        createNote(event.detail).then(renderNotes);

        animate(
          inputNoteElement,
          { scale: [1, 1.05, 1] },
          { duration: 0.3, easing: spring({ stiffness: 200, damping: 10 }) }
        );
      });
    }

    // Animate Note Items
    const noteItems = document.querySelectorAll('note-item');
    noteItems.forEach((item, index) => {
      animate(
        item,
        { opacity: [0, 1], y: [50, 0] },
        {
          delay: index * 0.1,
          duration: 1.5,
          easing: spring({ stiffness: 100, damping: 15 }),
        }
      );
    });
  } catch (error) {
    showErrorMessage('Failed to initialize app: ' + error.message);
  } finally {
    hideFullPageLoading();
  }
};

window.addEventListener('load', initializeApp);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    initializeApp();
  }
});
