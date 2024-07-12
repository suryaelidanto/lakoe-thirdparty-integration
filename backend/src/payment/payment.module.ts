import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { MidtransModule } from './midtrans/midtrans.module';

@Module({
  imports: [MidtransModule],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
