import { Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create() {
    try {
      return this.paymentService.create();
    } catch (err) {
      console.log(err);
    }
  }
}
