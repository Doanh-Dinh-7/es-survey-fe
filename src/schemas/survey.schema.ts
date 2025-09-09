import { z } from "zod";

export const surveySettingsSchema = z
  .object({
    openTime: z
      .string()
      .nullable()
      .refine((val: string | null) => !val || new Date(val) >= new Date(), {
        message: "Open time must be greater than or equal to current.",
      }),
    closeTime: z.string().nullable(),
    maxResponse: z
      .number()
      .nullable()
      .transform((val) => (val === null ? null : val)),
    autoCloseCondition: z.enum(["manual", "by_time", "by_response"]),
    requireEmail: z.boolean(),
    allowMultipleResponses: z.boolean(),
    responseLetter: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.openTime && data.closeTime) {
      if (new Date(data.closeTime) <= new Date(data.openTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Close time must be greater than open time.",
          path: ["closeTime"],
        });
      }
    }
  });

export type SurveySettingsSchema = z.infer<typeof surveySettingsSchema>;
