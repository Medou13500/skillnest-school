export type QuestionType = "test" | "quiz";

export type Difficulty = "facile" | "moyen" | "difficile";

export type CreateQuestionInput = {
  notionId: number;
  matiere: string;
  content: string;
  answers: string[];
  correctAnswer: string;
  type: QuestionType;
  difficulty: Difficulty;
};

export type UpdateQuestionInput = Partial<CreateQuestionInput>;

export type QuestionOutput = {
  id: number;
  notionId: number;
  matiere: string;
  content: string;
  answers: string[];
  correctAnswer: string;
  type: QuestionType;
  difficulty: Difficulty;
  createdAt: Date;
  updatedAt: Date;
};

export type GetQuestionsFilters = {
  type?: QuestionType;
  notionId?: number;
};
