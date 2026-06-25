import { Router, Request, Response } from "express";
import { calculate, isFailure } from "../services/calculatorService";
import { validateCalculateBody } from "../middleware/validateRequest";

const router = Router();

router.post("/", validateCalculateBody, (req: Request, res: Response) => {
  const { equation } = req.body as { equation: string };
  const outcome = calculate(equation);

  if (isFailure(outcome)) {
    res.status(422).json({ error: outcome.error, detail: outcome.detail });
    return;
  }

  res.status(200).json({ result: outcome.result, equation });
});

export default router;
