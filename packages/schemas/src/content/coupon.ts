import { createSelectSchema } from 'drizzle-zod';

import { couponCode } from '@sovereign-university/database/schemas';

export const couponCodeSchema = createSelectSchema(couponCode);
