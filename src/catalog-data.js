// Datos iniciales compartidos por el catálogo, la portada y el panel de administración.
const catalogCars = [
    {
        id: 'seat-leon-fr',
        name: 'Seat Leon FR',
        year: 2026,
        price: 38900,
        image: 'img/seatLeonFrMk42026.png',
        description: 'El SEAT León FR (Formula Racing) es un coche compacto de cinco puertas que combina una estética deportiva con un enfoque equilibrado para el uso diario.',
        specs: [
            'Motor: 1.5 eTSI / 115 CV',
            'Combustible: Híbrido',
            'Transmisión: Automática',
            'Potencia: 115 CV',
            'Puertas: 5',
            'Aceleración: 10,4 s 0-100 km/h'
        ],
        tags: ['Eficiente', 'Deportivo', 'Tecnología']
    },
    {
        id: 'ford-mustang',
        name: 'Ford Mustang',
        year: 2023,
        price: 58400,
        image: 'img/FordMustang2023.png',
        description: 'Clásico deportivo americano con motor V8 y comportamiento dinámico contundente.',
        specs: [
            'Motor: V8 5.0',
            'Combustible: Gasolina',
            'Transmisión: Automática',
            'Potencia: 480 CV',
            'Puertas: 2',
            'Aceleración: 4,3 s 0-100 km/h'
        ],
        tags: ['V8', 'Potencia', 'Icono']
    },
    {
        id: 'audi-q5',
        name: 'Audi Q5',
        year: 2022,
        price: 49200,
        image: 'img/AudiQ52022.png',
        description: 'SUV premium, cómoda y con buena eficiencia gracias a su versión híbrida.',
        specs: [
            'Motor: 2.0 TFSI / Híbrido',
            'Combustible: Híbrido',
            'Transmisión: Automática',
            'Potencia: 265 CV',
            'Puertas: 5',
            'Aceleración: 6,1 s 0-100 km/h'
        ],
        tags: ['SUV', 'Confort', 'Tecnología']
    },
    {
        id: 'bmw-serie-3',
        name: 'BMW Serie 3',
        year: 2024,
        price: 44800,
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
        description: 'Berlina premium con un equilibrio ideal entre deportividad, confort y tecnología.',
        specs: [
            'Motor: 2.0 Diesel',
            'Combustible: Diésel',
            'Transmisión: Automática',
            'Potencia: 190 CV',
            'Puertas: 4',
            'Aceleración: 7,5 s 0-100 km/h'
        ],
        tags: ['Berlina', 'Premium', 'Elegancia']
    },
    {
        id: 'audi-rs3',
        name: 'Audi RS3',
        year: 2024,
        price: 74985,
        image: 'img/AudiRs32024.png',
        description: 'El Audi RS3 es un deportivo compacto de altas prestaciones, con un motor de cinco cilindros y 400 CV, aerodinámica avanzada y tracción total quattro con divisor de par (torque splitter).',
        specs: [
            'Motor: 2.5 TFSI',
            'Combustible: Gasolina',
            'Transmisión: Automática',
            'Potencia: 400 CV',
            'Puertas: 5',
            'Aceleración: 3,8 s 0-100 km/h'
        ],
        tags: ['Sport', 'Quattro', '400 CV']
    },
    {
        id: 'mercedes-c-class',
        name: 'Mercedes C-Class',
        year: 2025,
        price: 46900,
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80',
        description: 'Sedán de lujo con tecnología avanzada y un interior muy refinado.',
        specs: [
            'Motor: 2.0 Hybrid',
            'Combustible: Híbrido',
            'Transmisión: Automática',
            'Potencia: 258 CV',
            'Puertas: 4',
            'Aceleración: 6,4 s 0-100 km/h'
        ],
        tags: ['Sedán', 'Lujoso', 'Seguridad']
    },
    {
        id: 'volkswagen-golf-gti',
        name: 'Volkswagen Golf GTI',
        year: 2024,
        price: 36700,
        image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
        description: 'Hatchback deportivo con gran carácter, rapidez y un estilo muy reconocible.',
        specs: [
            'Motor: 2.0 TSI',
            'Combustible: Gasolina',
            'Transmisión: Manual',
            'Potencia: 245 CV',
            'Puertas: 5',
            'Aceleración: 5,9 s 0-100 km/h'
        ],
        tags: ['GTI', 'Compacto', 'Rendimiento']
    },
    {
        id: 'bmw-m3',
        name: 'BMW M3',
        year: 2024,
        price: 100000,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/BMW_M3_Competition_%28G80%29_1X7A0170.jpg/960px-BMW_M3_Competition_%28G80%29_1X7A0170.jpg',
        description: 'Berlina deportiva de altas prestaciones con motor de seis cilindros y tracción integral M xDrive.',
        specs: [
            'Motor: 3.0 TwinPower Turbo',
            'Combustible: Gasolina',
            'Transmisión: Automática',
            'Tracción: M xDrive',
            'Potencia: 510 CV',
            'Puertas: 4',
            'Aceleración: 3,5 s 0-100 km/h'
        ],
        tags: ['M', 'M xDrive', '510 CV']
    },
    {
        id: 'golf-tsi-2018',
        name: 'Golf TSI',
        year: 2018,
        price: 28900,
        image: 'img/GolfTSIMk7.52018-card.jpeg',
        description: 'Volkswagen Golf TSI de cinco puertas, con motor de gasolina y carrocería hatchback.',
        specs: [
            'Motor: 1.4 TSI',
            'Combustible: Gasolina',
            'Transmisión: Manual',
            'Potencia: 130 CV',
            'Puertas: 5',
            'Aceleración: 9,1 s 0-100 km/h'
        ],
        tags: ['TSI', 'Compacto', 'Rendimiento']
    }
];
