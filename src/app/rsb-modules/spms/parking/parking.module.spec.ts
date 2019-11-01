import { ParkingModule } from './parking.module';

describe('ParkingModule', () => {
  let parkingModule: ParkingModule;

  beforeEach(() => {
    parkingModule = new ParkingModule();
  });

  it('should create an instance', () => {
    expect(ParkingModule).toBeTruthy();
  });
});
