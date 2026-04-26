// ================= TYPES DE BASE =================

export type QuestionType = "test" | "quiz";
export type Difficulty = "facile" | "moyen" | "difficile";


// ================= INPUT =================

export type CreateQuestionInput = {
  notionId: number;
  content: string;
  answers: string[];
  correctAnswer: string;
  type: QuestionType;
  difficulty: Difficulty;
};

export type UpdateQuestionInput = CreateQuestionInput;


// ================= OUTPUT ADMIN =================

export type QuestionOutput = {
  id: number;
  notionId: number;
  content: string;
  answers: string[];
  correctAnswer: string;
  type: QuestionType;
  difficulty: Difficulty;
  createdAt: Date;
  updatedAt: Date;
};


// ================= OUTPUT USER =================

export type QuestionPublicOutput = {
  id: number;
  notionId: number;
  content: string;
  answers: string[];
  type: QuestionType;
  difficulty: Difficulty;
  createdAt: Date;
  updatedAt: Date;
};


// ================= ENTITY (DB) =================

export type QuestionEntity = {
  id: number;
  notion_id: number;
  content: string;
  answers: string; // JSON string
  correct_answer: string;
  type: QuestionType;
  difficulty: Difficulty;
  created_at: Date;
  updated_at: Date;
};