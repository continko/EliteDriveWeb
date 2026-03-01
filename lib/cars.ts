export type PricingTier = {
  label: string;
  daysFrom: number;
  daysTo: number | null;
  dailyKmLimit: number;
  pricePerDay: number;
};

export type Car = {
  id: string;
  brand: string;
  name: string;
  year: number;
  color: string;
  imageUrl: string;
  transmission: "automat";
  fuel: "Benzín";
  drive: string;
  seats: number;
  pricing: PricingTier[];
  deposit: number;
  overLimitPerKm: number;
  minAge: number;
  minLicenseYears: number;
  power: string;
  consumption: string;
  tow: string;
  equipment: string[];
  bookedDates: string[];
};

export const cars: Car[] = [
  {
    id: "bmw-m5-f90-2023",
    brand: "BMW",
    name: "M5 Competition (F90)",
    year: 2023,
    color: "Marina Bay Blue",
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/2021-bmw-m5-competition-1146-1625696565.jpg",
    transmission: "automat",
    fuel: "Benzín",
    drive: "4x4 (xDrive)",
    seats: 5,
    pricing: [
      { label: "1 deň", daysFrom: 1, daysTo: 1, dailyKmLimit: 300, pricePerDay: 350 },
      { label: "2–3 dni", daysFrom: 2, daysTo: 3, dailyKmLimit: 250, pricePerDay: 290 },
      { label: "4–7 dní", daysFrom: 4, daysTo: 7, dailyKmLimit: 210, pricePerDay: 240 },
      { label: "8–14 dní", daysFrom: 8, daysTo: 14, dailyKmLimit: 180, pricePerDay: 210 },
      { label: "15–22 dní", daysFrom: 15, daysTo: 22, dailyKmLimit: 150, pricePerDay: 190 },
      { label: "23+ dní", daysFrom: 23, daysTo: null, dailyKmLimit: 120, pricePerDay: 150 }
    ],
    deposit: 2500,
    overLimitPerKm: 0.9,
    minAge: 18,
    minLicenseYears: 1,
    power: "460 kW / 625 hp",
    consumption: "11.1 L/100km",
    tow: "Nie",
    equipment: ["M Karbón-keramické brzdy", "Laserové svetlá", "Harman Kardon", "Odvietrané sedadlá", "360° kamera"],
    bookedDates: ["2026-03-05", "2026-03-06"] 
  },
  {
    id: "bmw-m3-g80-2024",
    brand: "BMW",
    name: "M3 Competition (G80)",
    year: 2024,
    color: "Brooklyn Grey",
    imageUrl: "https://media.dreamcargiveaways.co.uk/media/transformed/PVfnXHducLSeVGZpGCJww0?w=3840",
    transmission: "automat",
    fuel: "Benzín",
    drive: "4x4 (xDrive)",
    seats: 5,
    pricing: [
      { label: "1 deň", daysFrom: 1, daysTo: 1, dailyKmLimit: 300, pricePerDay: 350 },
      { label: "2–3 dni", daysFrom: 2, daysTo: 3, dailyKmLimit: 250, pricePerDay: 290 },
      { label: "4–7 dní", daysFrom: 4, daysTo: 7, dailyKmLimit: 210, pricePerDay: 240 },
      { label: "8–14 dní", daysFrom: 8, daysTo: 14, dailyKmLimit: 180, pricePerDay: 210 },
      { label: "15–22 dní", daysFrom: 15, daysTo: 22, dailyKmLimit: 150, pricePerDay: 190 },
      { label: "23+ dní", daysFrom: 23, daysTo: null, dailyKmLimit: 120, pricePerDay: 150 }
    ],
    deposit: 2500,
    overLimitPerKm: 0.9,
    minAge: 18,
    minLicenseYears: 1,
    power: "375 kW / 510 hp",
    consumption: "10.2 L/100km",
    tow: "Nie",
    equipment: ["Laser", "M Brzdy"],
    bookedDates: []
  },
  {
    id: "bmw-m3-g81-2024",
    brand: "BMW",
    name: "M3 Touring (G81)",
    year: 2024,
    color: "Isle of Man Green",
    imageUrl: "https://www.automoli.com/common/vehicles/_assets/img/gallery/f71/bmw-m3-touring-g81_1.jpg",
    transmission: "automat",
    fuel: "Benzín",
    drive: "4x4 (xDrive)",
    seats: 5,
    pricing: [
      { label: "1 deň", daysFrom: 1, daysTo: 1, dailyKmLimit: 300, pricePerDay: 350 },
      { label: "2–3 dni", daysFrom: 2, daysTo: 3, dailyKmLimit: 250, pricePerDay: 290 },
      { label: "4–7 dní", daysFrom: 4, daysTo: 7, dailyKmLimit: 210, pricePerDay: 240 },
      { label: "8–14 dní", daysFrom: 8, daysTo: 14, dailyKmLimit: 180, pricePerDay: 210 },
      { label: "15–22 dní", daysFrom: 15, daysTo: 22, dailyKmLimit: 150, pricePerDay: 190 },
      { label: "23+ dní", daysFrom: 23, daysTo: null, dailyKmLimit: 120, pricePerDay: 150 }
    ],
    deposit: 2500,
    overLimitPerKm: 0.8,
    minAge: 18,
    minLicenseYears: 1,
    power: "375 kW / 510 hp",
    consumption: "10.4 L/100km",
    tow: "Nie",
    equipment: ["Panoráma", "M Brzdy"],
    bookedDates: []
  },
  {
    id: "bmw-m4-g82-2025",
    brand: "BMW",
    name: "M4 Competition (G82)",
    year: 2025,
    color: "São Paulo Yellow",
    imageUrl: "https://www.mad4wheels.com/img/free-car-images/mobile/20895/bmw-m4-g82-coupe-2025-751707.jpg",
    transmission: "automat",
    fuel: "Benzín",
    drive: "4x4 (xDrive)",
    seats: 4,
    pricing: [
      { label: "1 deň", daysFrom: 1, daysTo: 1, dailyKmLimit: 300, pricePerDay: 350 },
      { label: "2–3 dni", daysFrom: 2, daysTo: 3, dailyKmLimit: 250, pricePerDay: 290 },
      { label: "4–7 dní", daysFrom: 4, daysTo: 7, dailyKmLimit: 210, pricePerDay: 240 },
      { label: "8–14 dní", daysFrom: 8, daysTo: 14, dailyKmLimit: 180, pricePerDay: 210 },
      { label: "15–22 dní", daysFrom: 15, daysTo: 22, dailyKmLimit: 150, pricePerDay: 190 },
      { label: "23+ dní", daysFrom: 23, daysTo: null, dailyKmLimit: 120, pricePerDay: 150 }
    ],
    deposit: 2500,
    overLimitPerKm: 0.9,
    minAge: 18,
    minLicenseYears: 1,
    power: "390 kW / 530 hp",
    consumption: "10.1 L/100km",
    tow: "Nie",
    equipment: ["Karbón", "M Brzdy"],
    bookedDates: []
  },
  {
    id: "bmw-x5m-2025",
    brand: "BMW",
    name: "X5M",
    year: 2025,
    color: "Dravit Grey",
    imageUrl: "https://s1.cdn.autoevolution.com/images/news/the-first-ever-2025-bmw-x5-m-cs-competition-sport-doesn-t-exist-yet-in-the-real-world-219597-7.jpg",
    transmission: "automat",
    fuel: "Benzín",
    drive: "4x4 (xDrive)",
    seats: 5,
    pricing: [
      { label: "1 deň", daysFrom: 1, daysTo: 1, dailyKmLimit: 300, pricePerDay: 350 },
      { label: "2–3 dni", daysFrom: 2, daysTo: 3, dailyKmLimit: 250, pricePerDay: 290 },
      { label: "4–7 dní", daysFrom: 4, daysTo: 7, dailyKmLimit: 210, pricePerDay: 240 },
      { label: "8–14 dní", daysFrom: 8, daysTo: 14, dailyKmLimit: 180, pricePerDay: 210 },
      { label: "15–22 dní", daysFrom: 15, daysTo: 22, dailyKmLimit: 150, pricePerDay: 190 },
      { label: "23+ dní", daysFrom: 23, daysTo: null, dailyKmLimit: 120, pricePerDay: 150 }
    ],
    deposit: 2500,
    overLimitPerKm: 0.8,
    minAge: 18,
    minLicenseYears: 1,
    power: "460 kW / 625 hp",
    consumption: "12.9 L/100km",
    tow: "Áno",
    equipment: ["M Brzdy", "Soft-close"],
    bookedDates: []
  },
  {
    id: "audi-rs3-2024",
    brand: "Audi",
    name: "RS3 8Y",
    year: 2024,
    color: "Kyalami Green",
    imageUrl: "https://media.ed.edmunds-media.com/audi/rs-3/2022/oem/2022_audi_rs-3_sedan_base_fq_oem_2_1600.jpg",
    transmission: "automat",
    fuel: "Benzín",
    drive: "4x4",
    seats: 5,
    pricing: [
      { label: "1 deň", daysFrom: 1, daysTo: 1, dailyKmLimit: 300, pricePerDay: 220 },
      { label: "2–3 dni", daysFrom: 2, daysTo: 3, dailyKmLimit: 250, pricePerDay: 200 },
      { label: "4–7 dní", daysFrom: 4, daysTo: 7, dailyKmLimit: 210, pricePerDay: 170 },
      { label: "8–14 dní", daysFrom: 8, daysTo: 14, dailyKmLimit: 180, pricePerDay: 150 },
      { label: "15–22 dní", daysFrom: 15, daysTo: 22, dailyKmLimit: 150, pricePerDay: 120 },
      { label: "23+ dní", daysFrom: 23, daysTo: null, dailyKmLimit: 120, pricePerDay: 100 }
    ],
    deposit: 2000,
    overLimitPerKm: 0.6,
    minAge: 18,
    minLicenseYears: 1,
    power: "294 kW / 400 hp",
    consumption: "9.1 L/100km",
    tow: "Nie",
    equipment: ["RS Výfuk", "Matrix LED"],
    bookedDates: []
  },
  {
    id: "audi-rs6-avant-2024",
    brand: "Audi",
    name: "RS6 Avant",
    year: 2024,
    color: "Nardo Grey",
    imageUrl: "https://cdn.motor1.com/images/mgl/W8oJZg/s1/2024-audi-rs6-avant-performance-pricing.jpg",
    transmission: "automat",
    fuel: "Benzín",
    drive: "4x4",
    seats: 5,
    pricing: [
      { label: "1 deň", daysFrom: 1, daysTo: 1, dailyKmLimit: 300, pricePerDay: 350 },
      { label: "2–3 dni", daysFrom: 2, daysTo: 3, dailyKmLimit: 250, pricePerDay: 290 },
      { label: "4–7 dní", daysFrom: 4, daysTo: 7, dailyKmLimit: 210, pricePerDay: 240 },
      { label: "8–14 dní", daysFrom: 8, daysTo: 14, dailyKmLimit: 180, pricePerDay: 210 },
      { label: "15–22 dní", daysFrom: 15, daysTo: 22, dailyKmLimit: 150, pricePerDay: 190 },
      { label: "23+ dní", daysFrom: 23, daysTo: null, dailyKmLimit: 120, pricePerDay: 150 }
    ],
    deposit: 2500,
    overLimitPerKm: 0.9,
    minAge: 18,
    minLicenseYears: 1,
    power: "463 kW / 630 hp",
    consumption: "12.4 L/100km",
    tow: "Áno",
    equipment: ["RS Performance", "Bang & Olufsen"],
    bookedDates: []
  },
  {
    id: "audi-rs7-2024",
    brand: "Audi",
    name: "RS7 Sportback",
    year: 2024,
    color: "Black",
    imageUrl: "https://www.abt-america.com/fileadmin/processed/c/1/csm_RS7_LE_USA_01_c169f03d0e.jpg",
    transmission: "automat",
    fuel: "Benzín",
    drive: "4x4",
    seats: 5,
    pricing: [
      { label: "1 deň", daysFrom: 1, daysTo: 1, dailyKmLimit: 300, pricePerDay: 350 },
      { label: "2–3 dni", daysFrom: 2, daysTo: 3, dailyKmLimit: 250, pricePerDay: 290 },
      { label: "4–7 dní", daysFrom: 4, daysTo: 7, dailyKmLimit: 210, pricePerDay: 240 },
      { label: "8–14 dní", daysFrom: 8, daysTo: 14, dailyKmLimit: 180, pricePerDay: 210 },
      { label: "15–22 dní", daysFrom: 15, daysTo: 22, dailyKmLimit: 150, pricePerDay: 190 },
      { label: "23+ dní", daysFrom: 23, daysTo: null, dailyKmLimit: 120, pricePerDay: 150 }
    ],
    deposit: 2500,
    overLimitPerKm: 0.9,
    minAge: 18,
    minLicenseYears: 1,
    power: "463 kW / 630 hp",
    consumption: "12.5 L/100km",
    tow: "Nie",
    equipment: ["Matrix LED", "RS Design blue"],
    bookedDates: []
  },
  {
    id: "mercedes-c63-amg-2023",
    brand: "Mercedes-Benz",
    name: "C63 AMG",
    year: 2023,
    color: "Matte Black",
    imageUrl: "https://images.pistonheads.com/nimg/46601/blobid0.jpg",
    transmission: "automat",
    fuel: "Benzín",
    drive: "4x4",
    seats: 5,
    pricing: [
      { label: "1 deň", daysFrom: 1, daysTo: 1, dailyKmLimit: 300, pricePerDay: 350 },
      { label: "2–3 dni", daysFrom: 2, daysTo: 3, dailyKmLimit: 250, pricePerDay: 290 },
      { label: "4–7 dní", daysFrom: 4, daysTo: 7, dailyKmLimit: 210, pricePerDay: 240 },
      { label: "8–14 dní", daysFrom: 8, daysTo: 14, dailyKmLimit: 180, pricePerDay: 210 },
      { label: "15–22 dní", daysFrom: 15, daysTo: 22, dailyKmLimit: 150, pricePerDay: 190 },
      { label: "23+ dní", daysFrom: 23, daysTo: null, dailyKmLimit: 120, pricePerDay: 150 }
    ],
    deposit: 2500,
    overLimitPerKm: 0.9,
    minAge: 18,
    minLicenseYears: 1,
    power: "500 kW / 680 hp",
    consumption: "6.9 L/100km",
    tow: "Nie",
    equipment: ["AMG Performance", "Burmester"],
    bookedDates: []
  },
  {
    id: "porsche-911-gt3",
    brand: "Porsche",
    name: "911 GT3 Clubsport",
    year: 2023,
    color: "Shark Blue",
    imageUrl: "https://cdn.elferspot.com/wp-content/uploads/2024/11/11/porsche-992-gt3-1.jpeg?class=xl",
    transmission: "automat",
    fuel: "Benzín",
    drive: "Zadný pohon",
    seats: 2,
    pricing: [
      { label: "1 deň", daysFrom: 1, daysTo: 1, dailyKmLimit: 300, pricePerDay: 750 },
      { label: "2–3 dni", daysFrom: 2, daysTo: 3, dailyKmLimit: 250, pricePerDay: 670 },
      { label: "4–7 dní", daysFrom: 4, daysTo: 7, dailyKmLimit: 210, pricePerDay: 620 },
      { label: "8–14 dní", daysFrom: 8, daysTo: 14, dailyKmLimit: 180, pricePerDay: 570 },
      { label: "15–22 dní", daysFrom: 15, daysTo: 22, dailyKmLimit: 150, pricePerDay: 530 },
      { label: "23+ dní", daysFrom: 23, daysTo: null, dailyKmLimit: 120, pricePerDay: 480 }
    ],
    deposit: 5000,
    overLimitPerKm: 1.3,
    minAge: 18,
    minLicenseYears: 1,
    power: "375 kW / 510 hp",
    consumption: "13.0 L/100km",
    tow: "Nie",
    equipment: ["Chrono Paket", "Karbónové sedačky"],
    bookedDates: []
  }
];

export function getCarById(id: string): Car | undefined {
  return cars.find((car) => car.id === id);
}