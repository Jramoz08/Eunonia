const bcrypt = require('bcryptjs');

async function generarHash() {
  const password = '1234';
  const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Hash generado:', hash);
}

generarHash();
