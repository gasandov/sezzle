import { Request, Response, NextFunction } from 'express';

export function validateCalculateBody(req: Request, res: Response, next: NextFunction): void {
  const { equation } = req.body ?? {};

  if (equation === undefined || equation === null) {
    res.status(422).json({ error: 'Missing field', detail: '"equation" is required' });
    return;
  }

  if (typeof equation !== 'string') {
    res.status(422).json({ error: 'Invalid field type', detail: '"equation" must be a string' });
    return;
  }

  next();
}
