/**
 * Contact Information Constants
 *
 * Centralized clinic information used across the application
 * Note: Contact methods are now managed through Strapi CMS (see contact-methods collection)
 */

// ==========================================
// CLINIC INFORMATION
// ==========================================

export const CLINIC_INFO = {
  name: "Saigon International Dental Clinic",
  vietNamName: "Nha Khoa Quốc Tế Sài Gòn",

  // Dialable phone values (raw)
  phone1: "+84396877518",
  phone2: "+84902759406",

  email: "sgnhakhoaquocte@gmail.com",

  // Addresses
  address: "132 3/2 Street, Hoa Hung Ward, Ho Chi Minh City, Vietnam",
  vietNamAddress: "132 3 Tháng 2, Hòa Hưng, Hồ Chí Minh 700000, Việt Nam",

  // Wait time & hours
  days: "Mon – Sun",
  hours: "8:00 AM – 7:00 PM",
  website: "https://nhakhoaquoctesg.vn",
  coordinates: {
    lat: 10.775413839246676,
    lng: 106.67969229159051,
  },
  youtube: "https://www.youtube.com/@sgdental.official",
  facebook: "https://www.facebook.com/saigonimplant",
  zalo: "https://zalo.me/866118687837492387",
  instagram: "https://www.instagram.com/sgdental.official/",
};
