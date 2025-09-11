import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

// implements 는 추상 클래스나 인터페이스의 모든 조건을 만족하는 새로운 클래스를 만들때 사용함
// extends 와는 다름.
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // run something before a request is handled
    // by the request handler
    // console.log('1. I am running before the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        // run something before the response is sent out
        // console.log('3. I am running before the response is sent out', data);
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, // exclude any properties that are not in the UserDto class
        });
      }),
    );
  }
}
