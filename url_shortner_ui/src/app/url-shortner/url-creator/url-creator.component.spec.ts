import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlCreatorComponent } from './url-creator.component';

describe('UrlCreatorComponent', () => {
  let component: UrlCreatorComponent;
  let fixture: ComponentFixture<UrlCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrlCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrlCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
