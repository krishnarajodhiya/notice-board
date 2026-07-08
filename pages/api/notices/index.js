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

  if (!publishDate || publishDate.trim() === '') {
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
  if (req.method === 'GET') {
    try {
      // Urgent first (desc puts 'Urgent' > 'Normal'), then newest publishDate
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: 'desc' },
          { publishDate: 'desc' },
        ],
      });
      return res.status(200).json(notices);
    } catch (error) {
      console.error('GET /api/notices error:', error);
      return res.status(500).json({ error: 'Failed to fetch notices.' });
    }
  }

  if (req.method === 'POST') {
    const errors = validateNoticeBody(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const { title, body: noticeBody, category, priority, publishDate, image } = req.body;
      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: noticeBody.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image && image.trim() !== '' ? image.trim() : null,
        },
      });
      return res.status(201).json(notice);
    } catch (error) {
      console.error('POST /api/notices error:', error);
      return res.status(500).json({ error: 'Failed to create notice.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}
