import { MicrolearningData } from '../models/BookModels';

const SESSION_KEY = 'ml_feed';

let _items: MicrolearningData[] = [];
let _startIndex = 0;

export function setFeed(items: MicrolearningData[], startIndex: number) {
    _items = items;
    _startIndex = startIndex;
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ items, startIndex }));
    } catch {}
}

export function updateFeedIndex(index: number) {
    _startIndex = index;
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...parsed, startIndex: index }));
        }
    } catch {}
}

export function getFeed(): { items: MicrolearningData[]; startIndex: number } {
    if (_items.length === 0) {
        try {
            const raw = sessionStorage.getItem(SESSION_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                _items = parsed.items ?? [];
                _startIndex = parsed.startIndex ?? 0;
            }
        } catch {}
    }
    return { items: _items, startIndex: _startIndex };
}
