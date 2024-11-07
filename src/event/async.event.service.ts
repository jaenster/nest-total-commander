import {Injectable, Type} from "@nestjs/common";

type InstanceOf<T> = T extends new (...args: any[]) => infer R ? R : never;
type Cb<T> = (event: Type<T>, data: InstanceOf<T>) => Promise<unknown>|unknown;

@Injectable()
export class AsyncEventService {
    public readonly subscribers = new Set<Cb<any>>;

    public subscribe<T>(callback: Cb<T>): void {
        this.subscribers.add(callback);
    }

    public async emit<T>(event: Type<T>, data: InstanceOf<T>): Promise<void> {
        for(const sub of this.subscribers) {
            await sub(event, data);
        }
    }
}