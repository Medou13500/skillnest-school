export type QuestionType = "test" | "quiz";

export type Difficulty = "facile" | "moyen" | "difficile";

export type CreateQuestionInput = {
  notionId: number;
  content: string;
  answers: string[];
  correctAnswer: string;
  type: QuestionType;
  difficulty: Difficulty;
};