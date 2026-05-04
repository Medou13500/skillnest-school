export type QuestionUpdateContract = {
  id: number;
  notionId: number;
  content: string;
  answers: string[];
  correctAnswer: string;
  type: string;
  difficulty: string;
  createdAt: Date;
  updatedAt: Date;
};