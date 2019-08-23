import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceUrlsComponent } from './resource-urls.component';

describe('ResourceUrlsComponent', () => {
  let component: ResourceUrlsComponent;
  let fixture: ComponentFixture<ResourceUrlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceUrlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceUrlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
