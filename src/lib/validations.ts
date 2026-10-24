import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
});

export const newsSchema = z.object({
  title: z.string().min(5).max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(20),
  image: z.string().max(500).optional(),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export const teacherSchema = z.object({
  fullName: z.string().min(3).max(100),
  subject: z.string().min(2).max(100),
  category: z.string().max(100).optional(),
  experience: z.coerce.number().int().min(0).max(60).optional(),
  photo: z.string().max(500).optional(),
  bio: z.string().max(5000).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional().or(z.literal("")),
  published: z.boolean().optional(),
});

export const eventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(10000),
  date: z.string().or(z.date()),
  time: z.string().max(20).optional(),
  location: z.string().max(200).optional(),
  image: z.string().max(500).optional(),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]).optional(),
});

export const achievementSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional(),
  category: z.string().min(2).max(100),
  image: z.string().max(500).optional(),
  date: z.string().optional(),
  studentName: z.string().max(100).optional(),
  level: z.string().max(50).optional(),
  published: z.boolean().optional(),
});

export const feedbackSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: z.string().min(9).max(20),
  email: z.string().email().optional().or(z.literal("")),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

export const scheduleSchema = z.object({
  className: z.string().min(1).max(50),
  dayOfWeek: z.coerce.number().int().min(1).max(6),
  period: z.coerce.number().int().min(1).max(12),
  subject: z.string().min(1).max(100),
  teacher: z.string().max(100).optional().nullable(),
  room: z.string().max(50).optional().nullable(),
  order: z.coerce.number().int().min(0).max(1000).optional(),
});

export const documentSchema = z.object({
  title: z.string().min(2).max(200),
  category: z.string().max(100).optional().nullable(),
  fileUrl: z.string().min(1).max(500),
  fileName: z.string().max(255).optional().nullable(),
  fileSize: z.coerce.number().int().min(0).optional().nullable(),
  fileType: z.string().max(50).optional().nullable(),
  published: z.boolean().optional(),
});

export const gallerySchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  coverImage: z.string().max(500).optional().nullable(),
  published: z.boolean().optional(),
  images: z
    .array(
      z.object({
        id: z.string().optional(),
        url: z.string().min(1).max(500),
        caption: z.string().max(500).optional().nullable(),
        order: z.coerce.number().int().min(0).max(1000).optional(),
      })
    )
    .optional(),
});

export const settingsSchema = z.object({
  siteName: z.string().min(1).max(300).optional(),
  siteDescription: z.string().max(2000).optional().nullable(),
  aboutText: z.string().max(20000).optional().nullable(),
  logo: z.string().max(500).optional().nullable(),
  heroImage: z.string().max(500).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  email: z.string().max(100).optional().nullable(),
  workHours: z.string().max(200).optional().nullable(),
  telegram: z.string().max(300).optional().nullable(),
  instagram: z.string().max(300).optional().nullable(),
  facebook: z.string().max(300).optional().nullable(),
  youtube: z.string().max(300).optional().nullable(),
  mapEmbed: z.string().max(10000).optional().nullable(),
  studentsCount: z.coerce.number().int().min(0).max(100000).optional().nullable(),
  teachersCount: z.coerce.number().int().min(0).max(10000).optional().nullable(),
  classesCount: z.coerce.number().int().min(0).max(1000).optional().nullable(),
  achievementsCount: z.coerce.number().int().min(0).max(100000).optional().nullable(),
  clubsCount: z.coerce.number().int().min(0).max(1000).optional().nullable(),
});
