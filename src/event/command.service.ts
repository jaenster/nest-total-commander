import {AsyncEventService} from "./async.event.service";
import {Inject, Injectable, Type} from "@nestjs/common";

type InstanceOf<T> = T extends new (...args: any[]) => infer R ? R : never;

@Injectable()
export class CommandService {

    @Inject()
    private readonly asyncEvent!: AsyncEventService;

    async emit<T=any>(event: T): Promise<void> {
        const constructor = Object.getPrototypeOf(event).constructor as Type<T>;
        return await this.asyncEvent.emit(constructor, event as InstanceOf<T>);
    }
}