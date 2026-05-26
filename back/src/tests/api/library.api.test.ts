import request from 'supertest';
import app from '../../app';

import { createLibraryScenario } from '../scenarios';
import { generateTestToken } from '../helpers/generateTestToken';
import { describe, expect, it } from 'vitest';

describe('GET /library', () => {
  it('should return user library', async () => {
    const { user } = await createLibraryScenario();

    const token = generateTestToken(user.id);

    const response = await request(app)
      .get('/api/library')
      .set('Cookie', [`token=${token}`]);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });
});
