import { VoucherModule } from './voucher.module';

describe('VoucherModule', () => {
  let voucherModule: VoucherModule;

  beforeEach(() => {
    voucherModule = new VoucherModule();
  });

  it('should create an instance', () => {
    expect(voucherModule).toBeTruthy();
  });
});
