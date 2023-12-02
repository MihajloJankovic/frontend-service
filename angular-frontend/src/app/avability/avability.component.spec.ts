import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvabilityComponent } from './avability.component';

describe('AvabilityComponent', () => {
  let component: AvabilityComponent;
  let fixture: ComponentFixture<AvabilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvabilityComponent]
    });
    fixture = TestBed.createComponent(AvabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
