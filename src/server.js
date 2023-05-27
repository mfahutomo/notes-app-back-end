// Mengimpor modul Hapi untuk membuat server
const Hapi = require('@hapi/hapi');
// Mengimpor file routes yang berisi definisi rute
const routes = require('./routes');

// Membuat fungsi async bernama init untuk menginisialisasi server
const init = async () => {
  // Membuat instance server Hapi dengan konfigurasi
  const server = Hapi.server({
    port: 5000, // Menentukan port server
    host: 'localhost', // Menentukan host server
    routes: {
      cors: {
        origin: ['*'], // Mengaktifkan CORS untuk menerima permintaan dari semua origin
      },
    },
  });

  // Menambahkan rute-rute yang telah didefinisikan dalam file routes ke server
  server.route(routes);

  // Memulai server
  await server.start();
  // Menampilkan informasi bahwa server telah berjalan
  console.log(`Server berjalan pada ${server.info.uri}`);
};

// Memanggil fungsi init untuk menjalankan server
init();

