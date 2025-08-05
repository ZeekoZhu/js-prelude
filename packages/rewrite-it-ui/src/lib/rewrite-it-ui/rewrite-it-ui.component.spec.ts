import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RewriteItUiComponent } from './rewrite-it-ui.component';

describe('RewriteItUiComponent', () => {
  let component: RewriteItUiComponent;
  let fixture: ComponentFixture<RewriteItUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewriteItUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RewriteItUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
