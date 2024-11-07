import {CustomTransportStrategy, Server} from "@nestjs/microservices";
import {commandTransportSymbol} from "../constants";
import {Subject} from "rxjs";
import {MessageHandler} from "@nestjs/microservices/interfaces";
import {Type} from "@nestjs/common";
import {AsyncEventService} from "../event/async.event.service";

type MapOfSubjects<T> = Map<Type<T>, Subject<T>>;
type InstanceOf<T> = T extends new (...args: any[]) => infer T ? T : never;


export class CommandTransporter extends Server implements CustomTransportStrategy {
    public readonly transportId = commandTransportSymbol;

    public readonly subjects: MapOfSubjects<unknown> = new Map();

    constructor(
        public readonly emitter: AsyncEventService
    ) {
        super();
    }

    listen(next: (...optionalParams: unknown[]) => any) {
        this.emitter.subscribe(this.emit.bind(this));
        this.register();
        next();
    }

    private register() {
        // nestjs incorrectly types the handlers as a string, but it is actually a Map<PatternMetadata, MessageHandler>
        const handlers = this.getHandlers() as
            any as [Type<unknown>|string, MessageHandler][];

        for(const [data, handler] of handlers) {
            if (typeof data === 'string') {
                continue; // cant deal with strings, as commands are objects
            }

            const subject = new Subject<unknown>();
            this.subjects.set(data, subject);

            subject.subscribe(handler);
        }
    }

    emit<T>(ctor: Type<T>, target: InstanceOf<T>) {
        this.subjects.get(ctor)?.next(target);
    }

    close(): any {
        this.subjects.forEach((subject) => subject.complete());
    }
}