import { Midtrans } from '@miwone/midtrans-client-typescript';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MidtransService {
  constructor(private readonly configService: ConfigService) {}

  async snap() {
    const snap = new Midtrans.Snap({
      isProduction:
        this.configService.get<string>('MIDTRANS_MODE') !== 'sandbox',
      serverKey: this.configService.get<string>('MIDTRANS_SERVER_KEY'),
      clientKey: this.configService.get<string>('MIDTRANS_CLIENT_KEY'),
    });

    const transaction = {
      transaction_details: {
        order_id: 'YOUR-ORDERID-123456',
        gross_amount: 10000,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: 'budi',
        last_name: 'pratama',
        email: 'budi.pra@example.com',
        phone: '08111222333',
      },
    };

    return await snap.createTransaction(transaction);
  }
}
