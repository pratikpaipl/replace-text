import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AddFundraisePage } from './add-fundraise.page';


describe('AddFundraisePage', () => {
  let component: AddFundraisePage;
  let fixture: ComponentFixture<AddFundraisePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddFundraisePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddFundraisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
