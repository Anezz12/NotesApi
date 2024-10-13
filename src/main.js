import './styles/style.css';
import './components/path.js';
import { animate, spring } from 'motion';

// API DICOIDNG & AUTH TOKEN
const API_BASE_URL = 'https://notes-api.dicoding.dev/v2';
const AUTH_TOKEN = '12345';

let allNotes = [];

// Fetch Data Notes
const fetchNotes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`);
    const data = await response.json();
    if (data.error) {
      throw new Error(data.message);
    }
    allNotes = data.data;
    return allNotes;
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
  const noteItemElement = document.querySelector('note-item');
  if (noteItemElement && noteItemElement.shadowRoot) {
    const gridContainer =
      noteItemElement.shadowRoot.querySelector('.grid-container');
    if (gridContainer) {
      gridContainer.innerHTML = ''; // Clear existing notes
      notes.forEach((note) => {
        gridContainer.appendChild(createNoteElement(note));
      });
    }
  }
};

// Create Note Element
const createNoteElement = (note) => {
  const card = document.createElement('div');
  card.className = 'card-note';

  const title = document.createElement('h4');
  title.textContent = note.title;

  const date = document.createElement('p');
  date.className = 'date';
  date.textContent = new Date(note.createdAt).toLocaleString();

  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = note.body;

  const deleteWrapper = document.createElement('div');
  deleteWrapper.className = 'note-delete';

  const deleteButton = document.createElement('button');
  deleteButton.className = 'button-delete';
  deleteButton.textContent = 'Delete';
  deleteButton.dataset.id = note.id;
  deleteButton.addEventListener('click', handleDelete);

  deleteWrapper.appendChild(deleteButton);
  card.append(title, date, desc, deleteWrapper);
  return card;
};

// Handle Delete
const handleDelete = async (event) => {
  const id = event.target.dataset.id;
  allNotes = await deleteNote(id);
  renderNotes(allNotes);
};

// Search Notes
const searchNotes = (query) => {
  return allNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.body.toLowerCase().includes(query.toLowerCase())
  );
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

// Add search
const addSearchFunctionality = () => {
  const noteItemElement = document.querySelector('note-item');
  if (noteItemElement && noteItemElement.shadowRoot) {
    let searchContainer =
      noteItemElement.shadowRoot.querySelector('.search-container');
    if (!searchContainer) {
      searchContainer = document.createElement('div');
      searchContainer.className = 'search-container';
      searchContainer.style.marginBottom = '20px';
      searchContainer.style.textAlign = 'center';

      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.placeholder = 'Search notes...';
      searchInput.style.padding = '8px';
      searchInput.style.marginRight = '8px';
      searchInput.style.borderRadius = '4px';
      searchInput.style.border = '1px solid #ccc';

      const searchButton = document.createElement('button');
      searchButton.textContent = 'Search';
      searchButton.style.padding = '8px 16px';
      searchButton.style.backgroundColor = '#1E88E5';
      searchButton.style.color = 'white';
      searchButton.style.border = 'none';
      searchButton.style.borderRadius = '4px';
      searchButton.style.cursor = 'pointer';

      searchContainer.appendChild(searchInput);
      searchContainer.appendChild(searchButton);

      const gridWrapper =
        noteItemElement.shadowRoot.querySelector('.grid-wrapper');
      if (gridWrapper) {
        gridWrapper.insertBefore(searchContainer, gridWrapper.firstChild);
      }

      const performSearch = () => {
        const query = searchInput.value;
        const filteredNotes = searchNotes(query);
        renderNotes(filteredNotes);
      };

      searchButton.addEventListener('click', performSearch);

      searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
          performSearch();
        }
      });
    }
  }
};

// Initialize App
const initializeApp = async () => {
  showFullPageLoading();
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    allNotes = await fetchNotes();

    // Create the initial structure
    const noteItemElement = document.querySelector('note-item');
    if (noteItemElement) {
      const gridWrapper = document.createElement('div');
      gridWrapper.className = 'grid-wrapper';

      const gridContainer = document.createElement('div');
      gridContainer.className = 'grid-container';

      gridWrapper.appendChild(gridContainer);

      noteItemElement.shadowRoot.appendChild(gridWrapper);
    }

    // Add search
    addSearchFunctionality();

    // Render notes
    renderNotes(allNotes);

    const inputNoteElement = document.querySelector('note-input');
    if (inputNoteElement) {
      animate(
        inputNoteElement,
        { opacity: [0, 1], scale: [0.9, 1] },
        { duration: 0.5, easing: spring({ stiffness: 100, damping: 15 }) }
      );

      inputNoteElement.addEventListener('note-added', async (event) => {
        allNotes = await createNote(event.detail);
        renderNotes(allNotes);

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
