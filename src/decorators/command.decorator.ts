import {MessagePattern} from "@nestjs/microservices";
import {Type} from "@nestjs/common";
import {commandTransportSymbol} from "../constants";

export function Command<T>(on: Type<T>) {
    const decorator = MessagePattern(on, commandTransportSymbol)

    return function(target: any, key: string, descriptor: PropertyDescriptor) {
        return decorator(target, key, descriptor);
    };
}