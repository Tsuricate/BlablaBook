import { z } from 'zod';

export const checkIdFromParams = async (reqParamsid: string): Promise<number> => {
  return await z.coerce.number().int().min(1).parseAsync(reqParamsid);
};
