import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatebusComponent } from './updatebus.component';

describe('UpdatebusComponent', () => {
  let component: UpdatebusComponent;
  let fixture: ComponentFixture<UpdatebusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatebusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatebusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
