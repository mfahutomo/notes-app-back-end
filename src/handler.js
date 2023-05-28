const { nanoid } = require('nanoid');
const { getEnvironmentVariable, setEnvironmentVariable } = require('postman-sandbox');
const notes = require('./notes');

// Handler untuk menambahkan catatan baru
const addNoteHandler = (request, h) => {
  // Mendapatkan data dari payload request
  const { title, tags, body } = request.payload;
  const id = nanoid(16); // Generate ID menggunakan nanoid
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  // Membuat objek newNote dengan data yang diterima
  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };

  // Menambahkan newNote ke dalam array notes
  notes.push(newNote);

  // Memeriksa apakah catatan berhasil ditambahkan
  const isSuccess = notes.filter((note) => note.id === id).length > 0;
  // Menyimpan ID ke dalam variabel lingkungan (environment)
  const noteIdVariable = 'noteId'; // Nama variabel lingkungan untuk menyimpan ID
  const currentNoteId = getEnvironmentVariable(noteIdVariable); // to get nilai current is from env

  // Mengecek apakah ID saat ini tidak ada atau kosong
  if (!currentNoteId) {
  // Jika ID kosong, mengatur nilai ID baru
    setEnvironmentVariable(noteIdVariable, id);
  } else {
  // Jika ID sudah ada, menambahkan ID baru dengan pemisah koma
    setEnvironmentVariable(noteIdVariable, `${currentNoteId},${id}`);
  }

  // Mengembalikan response berdasarkan keberhasilan menambahkan catatan
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });

  response.code(500);
  return response;
};

// Handler untuk mendapatkan semua catatan
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

// Handler untuk mendapatkan catatan berdasarkan ID
const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  // Mencari catatan dengan ID yang sesuai dalam array notes
  const note = notes.filter((n) => n.id === id)[0];

  // Mengembalikan response berdasarkan keberhasilan mendapatkan catatan
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Fungsi handler untuk mengedit catatan berdasarkan ID
const editNoteByIdHandler = (request, h) => {
  // Mendapatkan ID dari parameter request
  const { id } = request.params;

  // Mendapatkan data yang ingin diubah dari payload request
  const { title, tags, body } = request.payload;

  // Mendapatkan tanggal dan waktu saat ini dalam format ISO
  const updatedAt = new Date().toISOString();

  // Mencari index catatan berdasarkan ID
  const index = notes.findIndex((note) => note.id === id);

  // Jika catatan dengan ID tersebut ditemukan
  if (index !== -1) {
    // Mengganti nilai catatan dengan data yang baru
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    // Membuat response dengan status dan pesan berhasil
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // Jika catatan dengan ID tersebut tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. ID tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Fungsi handler untuk menghapus catatan berdasarkan ID
const deleteNoteByIdHandler = (request, h) => {
  // Mendapatkan ID dari parameter request
  const { id } = request.params;

  // Mencari index catatan berdasarkan ID
  const index = notes.findIndex((note) => note.id === id);

  // Jika catatan dengan ID tersebut ditemukan
  if (index !== -1) {
    // Menghapus catatan dari array menggunakan splice
    notes.splice(index, 1);

    // Membuat response dengan status dan pesan berhasil
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // Jika catatan dengan ID tersebut tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. ID tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
