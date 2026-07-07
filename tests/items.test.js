process.env.ADMIN_TOKEN = 'test-admin-token';

jest.mock('../services/itemService', () => ({
  getAllItems: jest.fn(),
  getItemById: jest.fn(),
  createItem: jest.fn(),
  updateItem: jest.fn(),
  deleteItem: jest.fn(),
}));

const request = require('supertest');
const app = require('../app');
const itemService = require('../services/itemService');

const sampleItem = {
  id: 1,
  title: 'Backend Engineering Intern',
  company: 'Zoho',
  location: 'Chennai',
  domain: 'Backend Development',
  requiredSkills: ['JavaScript', 'Node.js', 'SQL'],
  minimumCGPA: 7,
  academicYear: 3,
  stipend: 25000,
  internshipType: 'Onsite',
  description: 'Build REST APIs for internal productivity products.',
};

describe('Item routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /items returns all items', async () => {
    itemService.getAllItems.mockResolvedValue([sampleItem]);

    const response = await request(app).get('/items');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual([sampleItem]);
  });

  it('GET /items/:id returns one item', async () => {
    itemService.getItemById.mockResolvedValue(sampleItem);

    const response = await request(app).get('/items/1');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(sampleItem);
    expect(itemService.getItemById).toHaveBeenCalledWith('1');
  });

  it('GET /items/:id returns 404 when item does not exist', async () => {
    itemService.getItemById.mockResolvedValue(null);

    const response = await request(app).get('/items/999');

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe('Item not found');
  });

  it('POST /items requires an admin token', async () => {
    const response = await request(app).post('/items').send(sampleItem);

    expect(response.statusCode).toBe(401);
    expect(itemService.createItem).not.toHaveBeenCalled();
  });

  it('POST /items rejects an invalid admin token', async () => {
    const response = await request(app)
      .post('/items')
      .set('x-admin-token', 'wrong-token')
      .send(sampleItem);

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(itemService.createItem).not.toHaveBeenCalled();
  });

  it('POST /items creates an item with a valid admin token', async () => {
    itemService.createItem.mockResolvedValue(sampleItem);

    const response = await request(app)
      .post('/items')
      .set('x-admin-token', 'test-admin-token')
      .send(sampleItem);

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toEqual(sampleItem);
  });

  it('PUT /items/:id updates an item with a valid admin token', async () => {
    const updatedItem = { ...sampleItem, stipend: 30000 };
    itemService.updateItem.mockResolvedValue(updatedItem);

    const response = await request(app)
      .put('/items/1')
      .set('x-admin-token', 'test-admin-token')
      .send({ stipend: 30000 });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(updatedItem);
    expect(itemService.updateItem).toHaveBeenCalledWith('1', { stipend: 30000 });
  });

  it('PUT /items/:id rejects an invalid admin token', async () => {
    const response = await request(app)
      .put('/items/1')
      .set('x-admin-token', 'wrong-token')
      .send({ stipend: 30000 });

    expect(response.statusCode).toBe(401);
    expect(itemService.updateItem).not.toHaveBeenCalled();
  });

  it('PUT /items/:id returns 404 when item does not exist', async () => {
    itemService.updateItem.mockResolvedValue(null);

    const response = await request(app)
      .put('/items/999')
      .set('x-admin-token', 'test-admin-token')
      .send({ stipend: 30000 });

    expect(response.statusCode).toBe(404);
    expect(response.body.error.message).toBe('Item not found');
  });

  it('DELETE /items/:id returns 204 after deleting an item', async () => {
    itemService.deleteItem.mockResolvedValue(true);

    const response = await request(app)
      .delete('/items/1')
      .set('x-admin-token', 'test-admin-token');

    expect(response.statusCode).toBe(204);
    expect(response.body).toEqual({});
  });

  it('DELETE /items/:id rejects an invalid admin token', async () => {
    const response = await request(app)
      .delete('/items/1')
      .set('x-admin-token', 'wrong-token');

    expect(response.statusCode).toBe(401);
    expect(itemService.deleteItem).not.toHaveBeenCalled();
  });

  it('DELETE /items/:id returns 404 when item does not exist', async () => {
    itemService.deleteItem.mockResolvedValue(false);

    const response = await request(app)
      .delete('/items/999')
      .set('x-admin-token', 'test-admin-token');

    expect(response.statusCode).toBe(404);
    expect(response.body.error.message).toBe('Item not found');
  });
});
