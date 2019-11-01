import { ChecklistModule } from './checklist.module';


describe('TicketManagementModule', () => {
  let checklistModule: ChecklistModule;

  beforeEach(() => {
    checklistModule = new ChecklistModule();
  });

  it('should create an instance', () => {
    expect(checklistModule).toBeTruthy();
  });
});
