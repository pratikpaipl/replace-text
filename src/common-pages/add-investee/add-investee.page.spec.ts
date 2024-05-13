import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AddInvestee } from './add-investee.page';


describe('AddInvestee', () => {
  let component: AddInvestee;
  let fixture: ComponentFixture<AddInvestee>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddInvestee],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddInvestee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
