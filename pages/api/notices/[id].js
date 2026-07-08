import { prisma } from '../../../lib/prisma';

const VALID_CATEGORIES = ['Exam', 'Event', 'General'];
const VALID_PRIORITIES = ['Normal', 'Urgent'];

function validateNoticeBody(body) {
  const errors = [];
  const { title, body: noticeBody, category, priority, publishDate } = body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push('title is required and cannot be empty.');
  } else if (title.trim().length > 255) {
    errors.push('title must be 255 characters or fewer.');
  }

  if (!noticeBody || typeof noticeBody !== 'string' || noticeBody.trim() === '') {
    errors.push('body is required and cannot be empty.');
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}.`);
  }

  if (!priority || !VALID_PRIORITIES.includes(priority)) {
    errors.push(`priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
  }

  if (!publishDate || String(publishDate).trim() === '') {
    errors.push('publishDate is required.');
  } else {
    const parsed = new Date(publishDate);
    if (isNaN(parsed.getTime())) {
      errors.push('publishDate must be a valid date.');
    }
  }

  return errors;
}

export default async function handler(req, res) {
  const { id } = req.query;
  const noticeId = parseInt(id, 10);

  if (isNaN(noticeId)) {
    return res.status(400).json({ error: 'Invalid notice ID.' });
  }

  // GET single notice
  if (req.method === 'GET') {
    try {
      const notice = await prisma.notice.findUnique({ where: { id: noticeId } });
      if (!notice) return res.status(404).json({ error: 'Notice not found.' });
      return res.status(200).json(notice);
    } catch (error) {
      console.error(`GET /api/notices/${id} error:`, error);
      return res.status(500).json({ error: 'Failed to fetch notice.' });
    }
  }

  // PUT update notice
  if (req.method === 'PUT' || req.method === 'PATCH') {
    const errors = validateNoticeBody(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const existing = await prisma.notice.findUnique({ where: { id: noticeId } });
      if (!existing) return res.status(404).json({ error: 'Notice not found.' });

      const { title, body: noticeBody, category, priority, publishDate, image } = req.body;
      const updated = await prisma.notice.update({
        where: { id: noticeId },
        data: {
          title: title.trim(),
          body: noticeBody.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image && image.trim() !== '' ? image.trim() : null,
        },
      });
      return res.status(200).json(updated);
    } catch (error) {
      console.error(`PUT /api/notices/${id} error:`, error);
      return res.status(500).json({ error: 'Failed to update notice.' });
    }
  }

  // DELETE notice
  if (req.method === 'DELETE') {
    try {
      const existing = await prisma.notice.findUnique({ where: { id: noticeId } });
      if (!existing) return res.status(404).json({ error: 'Notice not found.' });

      await prisma.notice.delete({ where: { id: noticeId } });
      return res.status(200).json({ message: 'Notice deleted successfully.' });
    } catch (error) {
      console.error(`DELETE /api/notices/${id} error:`, error);
      return res.status(500).json({ error: 'Failed to delete notice.' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}
