import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
	arrowBackOutline,
	arrowForwardOutline,
	checkmarkCircle,
	closeOutline,
	helpCircleOutline,
	refreshOutline,
	trophyOutline
} from 'ionicons/icons';
import { QuestionService, ApiQuestion } from '../../../core/services/question.service';
import { firstValueFrom } from 'rxjs';

interface QuizQuestion {
	id: number;
	question: string;
	options: string[];
	correctIndex: number;
	type: 'quiz' | 'test';
	correctAnswer?: string;
	images: string[];
}

type SubjectKey = 'geographie' | 'maths' | 'anglais' | 'francais' | 'sciences' | 'svt';

interface PlacementSubject {
	key: SubjectKey;
	title: string;
	description: string;
	duration: string;
	accent: string;
	icon: string;
	questions: QuizQuestion[];
}

import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-quiz',
	templateUrl: './quiz.page.html',
	styleUrls: ['./quiz.page.scss'],
	standalone: true,
	imports: [IonicModule, CommonModule, FormsModule]
})
export class QuizPage implements OnInit {
	studentName = 'Emma Dubois';
	selectedSubjectKey: SubjectKey | null = null;
	isLoading = false;

	subjects: PlacementSubject[] = [
		{
			key: 'geographie',
			title: 'Geographie',
			description: 'Repérage, cartes et notions de territoire.',
			duration: '0 questions',
			accent: '#4caf50',
			icon: '🌍',
			questions: []
		},
		{
			key: 'maths',
			title: 'Maths',
			description: 'Calcul, logique et résolution de problèmes.',
			duration: '0 questions',
			accent: '#ef8431',
			icon: '🔢',
			questions: []
		},
		{
			key: 'anglais',
			title: 'Anglais',
			description: 'Vocabulaire, grammaire et compréhension.',
			duration: '0 questions',
			accent: '#2f8be6',
			icon: '🇬🇧',
			questions: []
		},
		{
			key: 'francais',
			title: 'Francais',
			description: 'Lecture, orthographe et vocabulaire.',
			duration: '0 questions',
			accent: '#4950b7',
			icon: '✍️',
			questions: []
		},
		{
			key: 'sciences',
			title: 'Sciences',
			description: 'Observation, démarche scientifique et notions de base.',
			duration: '0 questions',
			accent: '#0f9bb0',
			icon: '🧪',
			questions: []
		},
		{
			key: 'svt',
			title: 'SVT',
			description: 'Biologie, corps humain et environnement.',
			duration: '0 questions',
			accent: '#73c56d',
			icon: '🧬',
			questions: []
		}
	];

	currentQuestionIndex = 0;
	selectedAnswers: number[] = [];
	openAnswers: string[] = []; // Stockage pour les questions ouvertes
	isSubmitted = false;

	// Fullscreen image viewer state
	isImageFullscreen = false;
	activeImageIndex = 0;

	constructor(
		public router: Router,
		private route: ActivatedRoute,
		private questionService: QuestionService
	) {
		addIcons({
			'arrow-back-outline': arrowBackOutline,
			'arrow-forward-outline': arrowForwardOutline,
			'checkmark-circle': checkmarkCircle,
			'help-circle-outline': helpCircleOutline,
			'refresh-outline': refreshOutline,
			'trophy-outline': trophyOutline,
			'close-outline': closeOutline
		});

		this.restoreSubjectFromRoute();
	}

	ngOnInit(): void {
		void this.loadQuestions();
	}

	async loadQuestions(): Promise<void> {
		this.isLoading = true;
		try {
			const apiQuestions = await firstValueFrom(this.questionService.getAllQuestions());

			// On récupère TOUTES les questions pour le test de positionnement
			// Quel que soit leur type (quiz ou test) ou leur notionId
			const validQuestions = apiQuestions;

			// On répartit les questions dans les matières
			this.subjects.forEach(subject => {
				const subjectQuestions = validQuestions.filter(q =>
					this.normalizeSubjectKey(q.matiere) === subject.key
				);

				subject.questions = subjectQuestions.map(q => ({
					id: q.id,
					question: q.content,
					options: this.parseAnswers(q.answers),
					correctIndex: this.findCorrectIndex(q),
					type: q.type,
					correctAnswer: q.correctAnswer ?? q.correct_answer,
					images: this.parseImages(q.images)
				}));

				subject.duration = `${subject.questions.length} questions`;
			});
		} catch (error) {
			console.error('Erreur lors du chargement des questions:', error);
		} finally {
			this.isLoading = false;
		}
	}

	private parseAnswers(answers: string[] | string): string[] {
		if (Array.isArray(answers)) {
			return answers.filter((s) => typeof s === 'string' && s.trim().length > 0);
		}
		if (typeof answers === 'string') {
			try {
				const parsed = JSON.parse(answers);
				if (Array.isArray(parsed)) return parsed;
			} catch {}
			if (answers.includes(',')) {
				return answers.split(',').map(s => s.trim()).filter(s => s.length > 0);
			}
		}
		return [];
	}

	private parseImages(images: string[] | string | undefined): string[] {
		if (!images) return [];
		if (Array.isArray(images)) return images;
		try {
			const parsed = JSON.parse(images);
			if (Array.isArray(parsed)) return parsed;
		} catch {}
		return [];
	}

	private findCorrectIndex(q: ApiQuestion): number {
		const answers = this.parseAnswers(q.answers);
		const correct = q.correctAnswer ?? q.correct_answer ?? '';
		return Math.max(0, answers.findIndex(a => a === correct));
	}

	get selectedSubject(): PlacementSubject | null {
		return this.subjects.find((subject) => subject.key === this.selectedSubjectKey) ?? null;
	}

	get questions(): QuizQuestion[] {
		return this.selectedSubject?.questions ?? [];
	}

	get currentQuestion(): QuizQuestion {
		return this.questions[this.currentQuestionIndex];
	}

	get progressPercent(): number {
		if (this.questions.length === 0) {
			return 0;
		}

		return Math.round(((this.currentQuestionIndex + 1) / this.questions.length) * 100);
	}

	get score(): number {
		return this.questions.reduce((total, question, index) => {
			if (question.type === 'test') {
				const userAns = (this.openAnswers[index] || '').trim().toLowerCase();
				const correctAns = (question.correctAnswer || '').trim().toLowerCase();
				return total + (userAns === correctAns ? 1 : 0);
			}
			return total + (this.selectedAnswers[index] === question.correctIndex ? 1 : 0);
		}, 0);
	}

	get scorePercent(): number {
		if (this.questions.length === 0) {
			return 0;
		}

		return Math.round((this.score / this.questions.length) * 100);
	}

	get placementLevel(): string {
		if (this.scorePercent >= 80) {
			return 'Avancé';
		}

		if (this.scorePercent >= 50) {
			return 'Intermédiaire';
		}

		return 'Débutant';
	}

	private restoreSubjectFromRoute(): void {
		const subjectKey = this.normalizeSubjectKey(this.route.snapshot.queryParamMap.get('matiere'));
		if (subjectKey) {
			this.selectedSubjectKey = subjectKey;
		}
	}

	private normalizeSubjectKey(value: string | null | undefined): SubjectKey | null {
		const val = (value ?? '').trim().toLowerCase();
		switch (val) {
			case 'geographie':
			case 'géographie':
				return 'geographie';
			case 'maths':
				return 'maths';
			case 'anglais':
				return 'anglais';
			case 'francais':
			case 'français':
				return 'francais';
			case 'sciences':
				return 'sciences';
			case 'svt':
				return 'svt';
			default:
				return null;
		}
	}

	selectSubject(subject: PlacementSubject): void {
		this.selectedSubjectKey = subject.key;
		this.restartQuiz();
	}

	changeSubject(): void {
		this.restartQuiz();
		this.selectedSubjectKey = null;
	}

	selectAnswer(optionIndex: number): void {
		if (this.isSubmitted) {
			return;
		}

		this.selectedAnswers[this.currentQuestionIndex] = optionIndex;
	}

	isOptionSelected(optionIndex: number): boolean {
		return this.selectedAnswers[this.currentQuestionIndex] === optionIndex;
	}

	nextQuestion(): void {
		if (!this.selectedSubject) {
			return;
		}

		if (this.currentQuestionIndex < this.questions.length - 1) {
			this.currentQuestionIndex += 1;
			return;
		}

		this.submitQuiz();
	}

	previousQuestion(): void {
		if (!this.selectedSubject) {
			return;
		}

		if (this.currentQuestionIndex > 0) {
			this.currentQuestionIndex -= 1;
		}
	}

	submitQuiz(): void {
		this.isSubmitted = true;
	}

	restartQuiz(): void {
		this.currentQuestionIndex = 0;
		this.selectedAnswers = [];
		this.openAnswers = [];
		this.isSubmitted = false;
	}

	goBack(): void {
		if (this.isImageFullscreen) {
			this.closeFullscreen();
			return;
		}

		if (this.selectedSubjectKey) {
			this.changeSubject();
			return;
		}

		this.router.navigate(['/contenu-matiere']);
	}

	openFullscreen(index: number): void {
		this.activeImageIndex = index;
		this.isImageFullscreen = true;

		// Attendre que le DOM soit rendu pour scroller
		setTimeout(() => {
			const element = document.getElementById('fs-img-' + index);
			if (element) {
				element.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
			}
		}, 50);
	}

	closeFullscreen(): void {
		this.isImageFullscreen = false;
	}
}
