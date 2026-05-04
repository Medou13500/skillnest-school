import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuizTestPositionnementComponent } from './quiz-test-positionnement.component';

describe('QuizTestPositionnementComponent', () => {
  let component: QuizTestPositionnementComponent;
  let fixture: ComponentFixture<QuizTestPositionnementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizTestPositionnementComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizTestPositionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
