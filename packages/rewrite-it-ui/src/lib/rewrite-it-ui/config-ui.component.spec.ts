import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigUiComponent } from './config-ui.component';
import { vi } from 'vitest';

describe('RewriteItUiComponent', () => {
  let component: ConfigUiComponent;
  let fixture: ComponentFixture<ConfigUiComponent>;

  beforeEach(async () => {
    // Mock HTMLDialogElement showModal method for jsdom environment
    if (!HTMLDialogElement.prototype.showModal) {
      HTMLDialogElement.prototype.showModal = vi.fn();
    }
    if (!HTMLDialogElement.prototype.close) {
      HTMLDialogElement.prototype.close = vi.fn();
    }

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
