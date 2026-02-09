"use client"
import { Counter } from './Counter';


export default function Cart() {
    const { count } = Counter();
    return (
        <div>
            <p>Count: {count}</p>
        </div>
    )
}