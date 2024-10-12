class NotesItem extends HTMLElement {
  #shadowRoot;
  #style;
  #note;

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: 'open' });
    this.#style = document.createElement('style');
    this.#note = [];
  }

  connectedCallback() {
    this.render();
  }

  set note(value) {
    if (!Array.isArray(value)) {
      console.error('Invalid input: note must be an array');
      return;
    }
    this.#note = value;
    this.render();
  }

  get note() {
    return this.#note;
  }

  render() {
    this.#resetContent();
    this.#updateStyles();
    this.#createNoteElements();
  }

  #resetContent() {
    this.#shadowRoot.innerHTML = '';
  }

  #updateStyles() {
    this.#style.textContent = this.#getStyles();
    this.#shadowRoot.appendChild(this.#style);
  }

  #createNoteElements() {
    const wrapper = document.createElement('div');
    wrapper.className = 'grid-wrapper';

    const title = document.createElement('h1');
    title.className = 'all-notes';
    title.textContent = 'Semua Catatan Anda Akan Tampil Di Bawah Ini';
    wrapper.appendChild(title);

    const container = document.createElement('div');
    container.className = 'grid-container';

    this.#note.forEach((note) => {
      container.appendChild(this.#createNoteElement(note));
    });

    wrapper.appendChild(container);
    this.#shadowRoot.appendChild(wrapper);
  }

  #createNoteElement(note) {
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
    deleteButton.addEventListener('click', this.#handleDelete.bind(this));

    deleteWrapper.appendChild(deleteButton);

    card.append(title, date, desc, deleteWrapper);

    return card;
  }

  #handleDelete(event) {
    const id = event.target.dataset.id;
    console.log(`Delete note with id: ${id}`);
  }

  #getStyles() {
    return `
      :host {
        display: block;
        font-family: 'Arial', sans-serif;
      }
      .grid-wrapper {
        padding: 20px;
      }
      .all-notes {
        text-align: center;
        color: #1E88E5;
        margin-bottom: 20px;
      }
      .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      .card-note {
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 16px;
        display: flex;
        flex-direction: column;
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        position: relative;
        overflow: hidden;
      }
      .card-note:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
      .note-number {
        position: absolute;
        top: 8px;
        right: 8px;
        background-color: #1E88E5;
        color: white;
        padding: 2px 6px;
        border-radius: 12px;
        font-size: 12px;
      }
      .card-note h4 {
        margin-top: 0;
        margin-bottom: 8px;
        font-size: 18px;
        color: #333;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .card-note .date {
        font-size: 12px;
        color: #999;
        margin-bottom: 12px;
      }
      .card-note .desc {
        font-size: 14px;
        color: #666;
        margin-bottom: 16px;
        flex-grow: 1;
        word-wrap: break-word;
        overflow-wrap: break-word;
        overflow: auto;
        max-height: 150px;
      }
      .note-delete {
        align-self: flex-end;
      }
      .button-delete {
        background-color: #f44336;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s ease-in-out;
      }
      .button-delete:hover {
        background-color: #d32f2f;
      }
      @media (max-width: 600px) {
        .grid-container {
          grid-template-columns: 1fr;
        }
      }
    `;
  }
}

customElements.define('note-item', NotesItem);
