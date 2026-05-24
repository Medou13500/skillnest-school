export interface CreateQuestionContract {
  notionId?: number | null;
  content: string;
  answers: string[];
  correctAnswer: string;
  type: "test" | "quiz";
  difficulty: "facile" | "moyen" | "difficile";
}