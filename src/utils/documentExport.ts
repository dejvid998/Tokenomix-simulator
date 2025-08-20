
import { logger } from '@/lib/logger';
import type { Question, QuestionnaireData } from '@/types/questionnaire';

export const exportToDocx = async (
  questions: Question[],
  answers: QuestionnaireData
): Promise<void> => {
  const { Document, Packer, Paragraph, TextRun } = await import('docx');
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: "Tokenomics Questionnaire Responses",
              bold: true,
              size: 32,
            }),
          ],
        }),
        new Paragraph({ text: "" }),
        ...questions.map((q) => [
          new Paragraph({
            children: [
              new TextRun({
                text: q.question,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: answers[q.id] || 'Not answered',
              }),
            ],
          }),
          new Paragraph({ text: "" }),
        ]).flat(),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tokenomics-questionnaire.docx";
  a.click();
  window.URL.revokeObjectURL(url);
  logger.log('DOCX exported');
};
