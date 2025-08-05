import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigUiComponent } from './config-ui.component';

describe('RewriteItUiComponent', () => {
  let component: ConfigUiComponent;
  let fixture: ComponentFixture<ConfigUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
