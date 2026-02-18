import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['admin', 'user']).optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
});

export const zoneCreateSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    position_x: z.number().int().positive(),
    position_y: z.number().int().positive()
  })
});

export const zoneUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    position_x: z.number().int().positive().optional(),
    position_y: z.number().int().positive().optional()
  }),
  params: z.object({
    id: z.string().uuid()
  })
});

const normalizeDate = (value: unknown) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const slashMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slashMatch) {
    const part1 = Number(slashMatch[1]);
    const part2 = Number(slashMatch[2]);
    const year = slashMatch[3];
    if (part1 > 12 && part2 <= 12) {
      return `${year}-${String(part2).padStart(2, '0')}-${String(part1).padStart(2, '0')}`;
    }
    return `${year}-${String(part1).padStart(2, '0')}-${String(part2).padStart(2, '0')}`;
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return trimmed;
};

const dateString = z.preprocess(
  normalizeDate,
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD date string')
);

export const productCreateSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    batch_number: z.string().min(1),
    quantity: z.number().int().nonnegative(),
    expiration_date: dateString.optional(),
    zone_id: z.string().uuid().nullable().optional()
  })
});

export const productUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    batch_number: z.string().min(1).optional(),
    quantity: z.number().int().nonnegative().optional(),
    expiration_date: dateString.nullable().optional(),
    zone_id: z.string().uuid().nullable().optional()
  }),
  params: z.object({
    id: z.string().uuid()
  })
});

export const productQuerySchema = z.object({
  query: z.object({
    name: z.string().optional(),
    batch_number: z.string().optional(),
    expiration_date: dateString.optional(),
    zone_id: z.string().uuid().optional()
  })
});

export const zoneProductsSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
