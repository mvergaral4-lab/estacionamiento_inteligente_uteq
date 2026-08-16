import fs from 'fs';

const latBase = -1.012270;
const lngBase = -79.468280;
const espacios = {};

for (let c = 1; c <= 4; c++) {
  const colLetter = String.fromCharCode(64 + c);
  for (let n = 1; n <= 20; n++) {
    const numPad = String(n).padStart(2, '0');
    const id = `ESP-C0${c}-${numPad}`;
    const lat = latBase - (c * 0.00005);
    const lng = lngBase + (n * 0.00003);
    const dist = Math.floor(Math.random() * 180) + 20;
    const estado = dist <= 50 ? 'ocupado' : 'libre';

    espacios[id] = {
      id,
      columna: c,
      numero: n,
      distanciaDetectada: dist,
      estado,
      fechaHora: Date.now(),
      ubicacion: { latitud: lat, longitud: lng }
    };
  }
}

fs.writeFileSync('estacionamiento_80.json', JSON.stringify({ espacios }, null, 2));
console.log('¡Archivo estacionamiento_80.json generado con 80 espacios!');
