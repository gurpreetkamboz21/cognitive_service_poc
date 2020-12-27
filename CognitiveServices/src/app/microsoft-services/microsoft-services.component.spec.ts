import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrosoftServicesComponent } from './microsoft-services.component';

describe('MicrosoftServicesComponent', () => {
  let component: MicrosoftServicesComponent;
  let fixture: ComponentFixture<MicrosoftServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicrosoftServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicrosoftServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
