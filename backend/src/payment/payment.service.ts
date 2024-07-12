import { Injectable } from '@nestjs/common';
import { MidtransService } from './midtrans/midtrans.service';

@Injectable()
export class PaymentService {
  constructor(private readonly midtransService: MidtransService) {}

  async create() {
    return await this.midtransService.snap();
  }
}
