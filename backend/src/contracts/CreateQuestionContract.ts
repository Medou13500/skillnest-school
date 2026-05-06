export interface CreateQuestionContract {
  notionId: number;
  content: string;
  answers: string[];
  correctAnswer: string;
  type: "test" | "quiz";
  difficulty: "facile" | "moyen" | "difficile";
}