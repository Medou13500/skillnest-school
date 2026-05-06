import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, createOutline, trashOutline } from 'ionicons/icons';

interface CourseItem {
  id: number;
  theme: string;
  chapitre: string;
  titre: string;
  type: 'Leçon' | 'Quiz';
  matiere: string;
  niveau: string;
  duree: string;
  progression: string;
  statut: 'Publie' | 'Brouillon';
  description: string;
}

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.page.html',
  styleUrls: ['./admin-courses.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminCoursesPage {
  editingId: number | null = null;

  courses: CourseItem[] = [
    {
      id: 1,
      theme: 'Theme 1',
      chapitre: 'Variables & Types',
      titre: 'Introduction aux variables',
      type: 'Leçon',
      matiere: 'Algorithmique',
      niveau: 'Débutant',
      duree: '8 min',
      progression: '1/2',
      statut: 'Publie',
      description: 'Comprendre les variables, leur role et les types de donnees simples.'
    },
    {
      id: 2,
      theme: 'Theme 1',
      chapitre: 'Variables & Types',
      titre: 'Quiz Variables & Types',
      type: 'Quiz',
      matiere: 'Algorithmique',
      niveau: 'Débutant',
      duree: '5 min',
      progression: '1/2',
      statut: 'Publie',
      description: 'Verifier les bases sur la declaration et la lecture des variables.'
    },
    {
      id: 3,
      theme: 'Theme 2',
      chapitre: 'Conditions & Boucles',
      titre: 'Conditions simples',
      type: 'Leçon',
      matiere: 'Algorithmique',
      niveau: 'Intermédiaire',
      duree: '10 min',
      progression: '0/2',
      statut: 'Brouillon',
      description: 'Utiliser if, else et les conditions booleennes dans un algorithme.'
    }
  ];

  form: CourseItem = this.createEmptyCourse();

  constructor(
    public router: Router,
    private toastController: ToastController
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'create-outline': createOutline,
      'trash-outline': trashOutline
    });
  }

  get totalCourses(): number {
    return this.courses.length;
  }

  get totalLessons(): number {
    return this.courses.filter((course) => course.type === 'Leçon').length;
  }

  get totalQuizzes(): number {
    return this.courses.filter((course) => course.type === 'Quiz').length;
  }

  get isEditing(): boolean {
    return this.editingId !== null;
  }

  saveCourse(): void {
    if (!this.isFormValid()) {
      void this.presentToast('Complete le theme, le chapitre, le titre et la description.');
      return;
    }

    const payload: CourseItem = {
      ...this.form,
      theme: this.form.theme.trim(),
      chapitre: this.form.chapitre.trim(),
      titre: this.form.titre.trim(),
      matiere: this.form.matiere.trim(),
      duree: this.form.duree.trim(),
      progression: this.form.progression.trim(),
      description: this.form.description.trim()
    };

    if (this.editingId === null) {
      this.courses = [{ ...payload, id: Date.now() }, ...this.courses];
      void this.presentToast('Cours ajoute.');
    } else {
      this.courses = this.courses.map((course) =>
        course.id === this.editingId ? { ...payload, id: course.id } : course
      );
      void this.presentToast('Cours modifie.');
    }

    this.resetForm();
  }

  editCourse(course: CourseItem): void {
    this.editingId = course.id;
    this.form = { ...course };
  }

  deleteCourse(courseId: number): void {
    this.courses = this.courses.filter((course) => course.id !== courseId);

    if (this.editingId === courseId) {
      this.resetForm();
    }

    void this.presentToast('Cours supprime.');
  }

  resetForm(): void {
    this.editingId = null;
    this.form = this.createEmptyCourse();
  }

  trackByCourseId(_index: number, course: CourseItem): number {
    return course.id;
  }

  private createEmptyCourse(): CourseItem {
    return {
      id: 0,
      theme: '',
      chapitre: '',
      titre: '',
      type: 'Leçon',
      matiere: 'Algorithmique',
      niveau: 'Débutant',
      duree: '',
      progression: '0/1',
      statut: 'Brouillon',
      description: ''
    };
  }

  private isFormValid(): boolean {
    return Boolean(
      this.form.theme.trim() &&
      this.form.chapitre.trim() &&
      this.form.titre.trim() &&
      this.form.matiere.trim() &&
      this.form.description.trim()
    );
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1800,
      position: 'top',
      color: 'medium'
    });
    await toast.present();
  }
}
