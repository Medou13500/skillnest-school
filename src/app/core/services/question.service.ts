import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type QuestionDifficulty = 'facile' | 'moyen' | 'difficile';
export type QuestionType = 'test' | 'quiz';

export interface ApiQuestion {
  id: number;
  notionId?: number;
  notion_id?: number;
  matiere?: string;
  content: string;
  answers: string[] | string;
  correctAnswer?: string;
  correct_answer?: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  images?: string[] | string;
}

export interface SaveQuestionPayload {
  notionId?: number | null;
  matiere: string;
  content: string;
  answers: string[];
  correctAnswer: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  images?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private readonly apiBaseUrl = `${environment.apiUrl}/api/questions`;

  constructor(private http: HttpClient) {}

  getTestPositionnementQuestions(notionId?: number): Observable<ApiQuestion[]> {
    let params = new HttpParams().set('type', 'test');

    if (notionId) {
      params = params.set('notionId', String(notionId));
    }

    return this.http.get<ApiQuestion[]>(this.apiBaseUrl, { params });
  }

  getQuizQuestions(notionId?: number): Observable<ApiQuestion[]> {
    let params = new HttpParams().set('type', 'quiz');

    if (notionId) {
      params = params.set('notionId', String(notionId));
    }

    return this.http.get<ApiQuestion[]>(this.apiBaseUrl, { params });
  }

  getQuestionById(id: number): Observable<ApiQuestion> {
    return this.http.get<ApiQuestion>(`${this.apiBaseUrl}/${id}`);
  }

  getAllQuestions(): Observable<ApiQuestion[]> {
  return this.http.get<ApiQuestion[]>(this.apiBaseUrl);
}

  createQuestion(payload: SaveQuestionPayload): Observable<ApiQuestion> {
    return this.http.post<ApiQuestion>(this.apiBaseUrl, payload, {
      headers: this.authHeaders()
    });
  }

  updateQuestion(id: number, payload: Partial<SaveQuestionPayload>): Observable<ApiQuestion> {
    return this.http.put<ApiQuestion>(`${this.apiBaseUrl}/${id}`, payload, {
      headers: this.authHeaders()
    });
  }

  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${id}`, {
      headers: this.authHeaders()
    });
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') ?? localStorage.getItem('token');

    if (!token) {
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
