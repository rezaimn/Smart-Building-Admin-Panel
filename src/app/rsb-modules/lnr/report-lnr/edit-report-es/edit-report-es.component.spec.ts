import { EditReportComponentES } from './edit-report-es.component';

import { TestBed, async } from '@angular/core/testing';
describe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				EditReportComponentES
			],
		}).compileComponents();
	}));
	it('should create the app', async(() => {
		const fixture = TestBed.createComponent(EditReportComponentES);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	}));
	it(`should have as title 'app'`, async(() => {
		const fixture = TestBed.createComponent(EditReportComponentES);
		const app = fixture.debugElement.componentInstance;
		expect(app.title).toEqual('app');
	}));
	it('should render title in a h1 tag', async(() => {
		const fixture = TestBed.createComponent(EditReportComponentES);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
	}));
});
