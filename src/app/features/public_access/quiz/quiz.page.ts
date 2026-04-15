import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
	arrowBackOutline,
	arrowForwardOutline,
	checkmarkCircle,
	helpCircleOutline,
	refreshOutline,
	trophyOutline
} from 'ionicons/icons';

interface QuizQuestion {
	id: number;
	question: string;
	options: string[];
	correctIndex: number;
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

@Component({
	selector: 'app-quiz',
	templateUrl: './quiz.page.html',
	styleUrls: ['./quiz.page.scss'],
	standalone: true,
	imports: [IonicModule, CommonModule]
})
export class QuizPage {
	studentName = 'Emma Dubois';
	selectedSubjectKey: SubjectKey | null = null;

	subjects: PlacementSubject[] = [
		{
			key: 'geographie',
			title: 'Geographie',
			description: 'Repérage, cartes et notions de territoire.',
			duration: '3 questions',
			accent: '#4caf50',
			icon: '🌍',
			questions: [
				{
					id: 1,
					question: 'Quel continent se trouve au sud de l’Europe ?',
					options: ['L’Afrique', 'L’Asie', 'L’Océanie', 'L’Amérique du Nord'],
					correctIndex: 0
				},
				{
					id: 2,
					question: 'Qu’est-ce qu’une échelle sur une carte ?',
					options: ['Un lieu', 'Un rapport de distance', 'Un climat', 'Une frontière'],
					correctIndex: 1
				},
				{
					id: 3,
					question: 'Quel document sert à localiser des reliefs ?',
					options: ['Une carte topographique', 'Un roman', 'Un graphique', 'Un carnet de notes'],
					correctIndex: 0
				}
			]
		},
		{
			key: 'maths',
			title: 'Maths',
			description: 'Calcul, logique et résolution de problèmes.',
			duration: '3 questions',
			accent: '#ef8431',
			icon: '🔢',
			questions: [
				{
					id: 1,
					question: 'Combien vaut 7 × 8 ?',
					options: ['54', '56', '64', '72'],
					correctIndex: 1
				},
				{
					id: 2,
					question: 'Quelle expression est une fraction ?',
					options: ['5 + 2', '9 / 3', '7 - 1', '4 × 2'],
					correctIndex: 1
				},
				{
					id: 3,
					question: 'Quel terme désigne le résultat d’une addition ?',
					options: ['Produit', 'Différence', 'Somme', 'Quotient'],
					correctIndex: 2
				}
			]
		},
		{
			key: 'anglais',
			title: 'Anglais',
			description: 'Vocabulaire, grammaire et compréhension.',
			duration: '3 questions',
			accent: '#2f8be6',
			icon: 'A',
			questions: [
				{
					id: 1,
					question: 'Comment dit-on “bonjour” en anglais ?',
					options: ['Hello', 'Thanks', 'Goodbye', 'Please'],
					correctIndex: 0
				},
				{
					id: 2,
					question: 'Quel mot est un verbe ?',
					options: ['Blue', 'Run', 'Dog', 'Chair'],
					correctIndex: 1
				},
				{
					id: 3,
					question: 'Le pluriel de “book” est :',
					options: ['books', 'bookes', 'bok', 'booking'],
					correctIndex: 0
				}
			]
		},
		{
			key: 'francais',
			title: 'Francais',
			description: 'Lecture, orthographe et vocabulaire.',
			duration: '3 questions',
			accent: '#4950b7',
			icon: '✍️',
			questions: [
				{
					id: 1,
					question: 'Quel est le féminin de “acteur” ?',
					options: ['Acteuse', 'Actrice', 'Acter', 'Actoriale'],
					correctIndex: 1
				},
				{
					id: 2,
					question: 'Une phrase se termine généralement par :',
					options: ['Une virgule', 'Un point', 'Un tiret', 'Un accent'],
					correctIndex: 1
				},
				{
					id: 3,
					question: 'Quel mot est un synonyme de “rapide” ?',
					options: ['Lent', 'Vif', 'Paresseux', 'Vide'],
					correctIndex: 1
				}
			]
		},
		{
			key: 'sciences',
			title: 'Sciences',
			description: 'Observation, démarche scientifique et notions de base.',
			duration: '3 questions',
			accent: '#0f9bb0',
			icon: '🧪',
			questions: [
				{
					id: 1,
					question: 'Quel outil sert à mesurer la température ?',
					options: ['Thermomètre', 'Boussole', 'Balance', 'Chronomètre'],
					correctIndex: 0
				},
				{
					id: 2,
					question: 'L’eau bout à environ :',
					options: ['0°C', '25°C', '100°C', '200°C'],
					correctIndex: 2
				},
				{
					id: 3,
					question: 'Quel sens permet de percevoir un son ?',
					options: ['La vue', 'L’ouïe', 'L’odorat', 'Le toucher'],
					correctIndex: 1
				}
			]
		},
		{
			key: 'svt',
			title: 'SVT',
			description: 'Biologie, corps humain et environnement.',
			duration: '3 questions',
			accent: '#73c56d',
			icon: '🧬',
			questions: [
				{
					id: 1,
					question: 'Quel organe pompe le sang ?',
					options: ['Le foie', 'Le cœur', 'Le poumon', 'L’estomac'],
					correctIndex: 1
				},
				{
					id: 2,
					question: 'Les plantes ont besoin de quoi pour la photosynthèse ?',
					options: ['Lumière', 'Pluie seulement', 'Sable', 'Vent'],
					correctIndex: 0
				},
				{
					id: 3,
					question: 'Quel est le support principal du corps humain ?',
					options: ['Les muscles', 'Le squelette', 'La peau', 'Les nerfs'],
					correctIndex: 1
				}
			]
		}
	];

	currentQuestionIndex = 0;
	selectedAnswers: number[] = [];
	isSubmitted = false;

	constructor(
		public router: Router,
		private route: ActivatedRoute
	) {
		addIcons({
			'arrow-back-outline': arrowBackOutline,
			'arrow-forward-outline': arrowForwardOutline,
			'checkmark-circle': checkmarkCircle,
			'help-circle-outline': helpCircleOutline,
			'refresh-outline': refreshOutline,
			'trophy-outline': trophyOutline
		});

		this.restoreSubjectFromRoute();
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

	private normalizeSubjectKey(value: string | null): SubjectKey | null {
		switch ((value ?? '').toLowerCase()) {
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
		this.isSubmitted = false;
	}

	goBack(): void {
		if (this.selectedSubjectKey) {
			this.changeSubject();
			return;
		}

		this.router.navigate(['/contenu-matiere']);
	}
}
