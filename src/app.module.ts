import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';

//All database configurations are available in this file.
//Database: postgres
@Module({
  imports: [UsersModule,
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({

        isGlobal: true,
        envFilePath: '.local.env'

      })],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: configService.get('DB_SYNC'),
        entities: [__dirname + '/**/*.entity{.ts,.js}']
      }),
      inject: [ConfigService]
    }),

    TwilioModule.forRoot({
      accountSid: "ACdd07930fe74868fa1c33728c11341649",
      authToken: "e0b080239aa49d436f8d44634370b318",
    }),
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
