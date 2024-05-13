import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddInvestor } from './add-investor.page';

describe('AddInvestor', () => {
  let component: AddInvestor;
  let fixture: ComponentFixture<AddInvestor>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddInvestor],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddInvestor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
