
export type SubmitAnswerInput = {
  questionId: number;
  selectedAnswer: string;
};


export type AnswerEntity = {
  id: number;
  userId: number;
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  createdAt: Date;
};



export type SubmitAnswerOutput = {
  isCorrect: boolean;
};