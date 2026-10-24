/**
 * O'zbekcha asosiy (source) lug'at — haqiqiy interfeys matnlari, demo emas.
 * Boshqa tillar uchun tarjimalar DB (Translation jadvali) orqali boshqariladi.
 */
export const LOCALES = ["uz", "ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "uz";
export const LOCALE_COOKIE = "locale";

export const baseDictionary = {
  "nav.home": "Bosh sahifa",
  "nav.about": "Maktab haqida",
  "nav.administration": "Ma'muriyat",
  "nav.teachers": "O'qituvchilar",
  "nav.students": "O'quvchilar",
  "nav.parents": "Ota-onalar",
  "nav.news": "Yangiliklar",
  "nav.events": "Tadbirlar",
  "nav.achievements": "Yutuqlar",
  "nav.gallery": "Galereya",
  "nav.documents": "Hujjatlar",
  "nav.schedule": "Dars jadvali",
  "nav.reception": "Virtual qabulxona",
  "nav.contact": "Aloqa",
  "nav.more": "Yana",
  "nav.search": "Qidiruv",
  "footer.sections": "Bo'limlar",
  "footer.contact": "Aloqa",
  "footer.socials": "Ijtimoiy tarmoqlar",
  "footer.rights": "Barcha huquqlar himoyalangan.",
  "footer.madeFor": "Sayt maktab uchun yaratilgan.",
  "footer.about": "Zamonaviy ta'lim, yuksak tarbiya va porloq kelajak sari.",
  "footer.schoolType": "Umumiy o'rta ta'lim maktabi",
  "hero.badge": "Zamonaviy ta'lim maskani",
  "hero.aboutBtn": "Maktab haqida",
  "hero.newsBtn": "Yangiliklar",
  "hero.students": "O'quvchilar",
  "hero.teachers": "O'qituvchilar",
  "hero.achievements": "Yutuqlar",
  "hero.title": "Chortoq tumani 6-sonli umumiy o'rta ta'lim maktabi",
  "hero.subtitle": "Zamonaviy ta'lim, yuksak tarbiya va porloq kelajak sari — biz har bir o'quvchining iqtidorini kashf etamiz va rivojlantiramiz.",
  "hero.cardTitle": "Biz bilan kelajak sari",
  "hero.cardSub": "Har bir bola — yulduz",
  "hero.imageAlt": "Maktab binosi",
  "home.latestNews": "So'nggi yangiliklar",
  "home.latestNewsSub": "Maktab hayotidagi eng so'nggi xabarlar",
  "home.all": "Barchasi",
  "home.about": "Biz haqimizda",
  "home.aboutTitle": "Kelajak avlodni tarbiyalaymiz",
  "home.aboutText": "6-sonli maktab — Namangan viloyati Chortoq tumanidagi yetakchi ta'lim dargohlaridan biri. Bizda tajribali ustozlar, zamonaviy o'quv xonalari va boy kutubxona mavjud. Har bir o'quvchining iqtidorini yuzaga chiqarish — bosh maqsadimiz.",
  "home.aboutBtn": "Batafsil",
  "home.administration": "Ma'muriyat",
  "home.teachers": "O'qituvchilar",
  "home.events": "Yaqin tadbirlar",
  "home.achievements": "Yutuqlar",
  "home.gallery": "Galereya",
  "home.reception": "Virtual qabulxona",
  "home.receptionText": "Savol, taklif yoki murojaatingizni bevosita ma'muriyatga yuboring. Tez orada javob olasiz.",
  "home.receptionBtn": "Murojaat yuborish",
  "home.contact": "Aloqa",
  "home.contactBtn": "Batafsil",
  "home.imageCount": "ta rasm",
  "common.yil": "yil",
  "common.views": "ko'rishlar",
  "empty.noData": "Ma'lumotlar hali kiritilmagan.",
  "empty.noNews": "Hozircha yangiliklar yo'q.",
  "empty.noTeachers": "O'qituvchilar ro'yxati hali kiritilmagan.",
  "empty.noEvents": "Hozircha tadbirlar yo'q.",
  "empty.noAchievements": "Yutuqlar hali qo'shilmagan.",
  "empty.noGallery": "Rasmlar hali qo'shilmagan.",
  "empty.noDocuments": "Hujjatlar hali qo'shilmagan.",
  "empty.noSchedule": "Dars jadvali hali kiritilmagan.",
  "empty.noAdministration": "Ma'muriyat ma'lumotlari hali kiritilmagan.",
  "empty.noSearch": "Hech narsa topilmadi.",
  "empty.noStats": "Statistika hali kiritilmagan.",
  "empty.noImage": "Rasm joylanmagan",
  "search.title": "Qidiruv",
  "search.placeholder": "Qidirish...",
  "search.button": "Qidirish",
  "schedule.title": "Dars jadvali",
  "schedule.sub": "Sinflar bo'yicha haftalik dars jadvali",
  "schedule.allClasses": "Barcha sinflar",
  "schedule.day": "Kun",
  "schedule.period": "Dars",
  "schedule.subject": "Fan",
  "schedule.teacher": "O'qituvchi",
  "schedule.room": "Xona",
  "schedule.dushanba": "Dushanba",
  "schedule.seshanba": "Seshanba",
  "schedule.chorshanba": "Chorshanba",
  "schedule.payshanba": "Payshanba",
  "schedule.juma": "Juma",
  "schedule.shanba": "Shanba",
} as const;

export type TranslationKey = keyof typeof baseDictionary;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function translate(dict: Record<string, string>, key: string): string {
  return dict[key] ?? (baseDictionary as Record<string, string>)[key] ?? key;
}
