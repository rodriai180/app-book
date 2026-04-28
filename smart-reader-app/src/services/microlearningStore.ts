import { MicrolearningData } from '../models/BookModels';

let _items: MicrolearningData[] = [];
let _startIndex = 0;

export function setFeed(items: MicrolearningData[], startIndex: number) {
    _items = items;
    _startIndex = startIndex;
}

export function getFeed(): { items: MicrolearningData[]; startIndex: number } {
    return { items: _items, startIndex: _startIndex };
}
