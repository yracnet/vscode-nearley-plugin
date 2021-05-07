export const handlerList = (key = 'id', setState) => {
    return {
        append: (item) => {
            item[key] = '' + (item[key] ? item[key] : new Date().getTime())
            setState(state => {
                return [item, ...state]
            })
        },
        remove: (item) => {
            const id = typeof item === 'string' ? item : item[key];
            setState(state => {
                return state.filter(it => it[key] !== id)
            })
        },
        update: (item) => {
            const id = item[key];
            setState(state => {
                return state.map(it => it[key] === id ? item : it)
            })
        },
        onChange: handlerOnChange(setState)
    }

}
const FN_ID = (state) => state

export const handlerOnChange = (state, setState, postChange = FN_ID) => {
    return ({ target }) => {
        const { name, value } = target;
        if (!name || name === '.') {
            console.warn('Target element requiere name attribute', target);
        } else if (name.includes('.')) {
            let newState = Array.isArray(state) ? [...state] : { ...state }
            let ref = newState;
            const keys = name.split('.');
            const key = keys.pop();
            keys.forEach(key => {
                if (!ref[key]) {
                    ref[key] = {};
                }
                ref = ref[key];
            });
            ref[key] = value;
            newState = postChange(newState);
            setState(newState);
        } else {
            let newState = Array.isArray(state) ? [...state] : { ...state }
            newState[name] = value;
            newState = postChange(newState);
            setState(newState);
        }
    }
}


export const handlerOnKey = (command, callback = console.log) => {

    const eks = command
        .split('+')
        .map(it => it.trim())
        .reduce((map, it) => {
            const key = SF_KEY[it.toLowerCase()]
            if (key) {
                map[key] = true
            } else {
                const key = SS_KEY[it]
                if (key) {
                    map.keyCode = key
                    map.key = it
                } else {
                    const key = SS_KEY[it.toLowerCase()]
                    if (key) {
                        map.keyCode = key
                        map.key = it
                    }
                }
            }
            return map;
        }, { key: "", ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, keyCode: -1 });

    const eventKey = (e) => Object.keys(e)
        .filter(it => it.endsWith('Key') || it.startsWith('key'))
        .reduce((map, it) => ({ ...map, [it]: e[it] }), {});

    return (e, ...others) => {
        const ek = eventKey(e);
        if (
            ek.ctrlKey === eks.ctrlKey &&
            ek.shiftKey === eks.shiftKey &&
            ek.altKey === eks.altKey &&
            ek.metaKey === eks.metaKey &&
            ek.keyCode === eks.keyCode
        ) {
            callback(e, ...others);
        }
    }
}



const SF_KEY = {
    'ctrl': 'ctrlKey',
    'shift': 'shiftKey',
    'alt': 'altKey',
    'meta': 'metaKey'
}



const SS_KEY = {
    'break': 3,
    'backspace': 8,
    'tab': 9,
    'clear': 12,
    'enter': 13,
    'pause': 19,
    'inter': 19,
    'caps lock': 20,
    'escape': 27,
    'spacebar': 32,
    'page up': 33,
    'page down': 34,
    'end': 35,
    'home': 36,
    'left arrow': 37,
    'up arrow': 38,
    'right arrow': 39,
    'down arrow': 40,
    'select': 41,
    'print': 42,
    'execute': 43,
    'print screen': 44,
    'insert': 45,
    'delete': 46,
    'help': 47,
    '0': 48,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
    ':': 58,
    '<': 60,
    'a': 65,
    'b': 66,
    'c': 67,
    'd': 68,
    'e': 69,
    'f': 70,
    'g': 71,
    'h': 72,
    'i': 73,
    'j': 74,
    'k': 75,
    'l': 76,
    'm': 77,
    'n': 78,
    'o': 79,
    'p': 80,
    'q': 81,
    'r': 82,
    's': 83,
    't': 84,
    'u': 85,
    'v': 86,
    'w': 87,
    'x': 88,
    'y': 89,
    'z': 90,
    //'Windows Key / Left ⌘ / Chromebook Search key': 91,
    //'right window key': 92,
    //'Windows Menu / Right ⌘': 93,
    'sleep': 95,
    'numpad 0': 96,
    'numpad 1': 97,
    'numpad 2': 98,
    'numpad 3': 99,
    'numpad 4': 100,
    'numpad 5': 101,
    'numpad 6': 102,
    'numpad 7': 103,
    'numpad 8': 104,
    'numpad 9': 105,
    'multiply': 106,
    'add': 107,
    //'numpad period (firefox)': 108,
    'subtract': 109,
    //'decimal point': 110,
    'divide': 111,
    'f1': 112,
    'f2': 113,
    'f3': 114,
    'f4': 115,
    'f5': 116,
    'f6': 117,
    'f7': 118,
    'f8': 119,
    'f9': 120,
    'f10': 121,
    'f11': 122,
    'f12': 123,
    'f13': 124,
    'f14': 125,
    'f15': 126,
    'f16': 127,
    'f17': 128,
    'f18': 129,
    'f19': 130,
    'f20': 131,
    'f21': 132,
    'f22': 133,
    'f23': 134,
    'f24': 135,
    'f25': 136,
    'f26': 137,
    'f27': 138,
    'f28': 139,
    'f29': 140,
    'f30': 141,
    'f31': 142,
    'f32': 143,
    //'num lock': 144,
    //'scroll lock': 145,
    //'airplane mode': 151,
    '^': 160,
    '!': 161,
    //'؛ (arabic semicolon)': 162,
    '#': 163,
    '$': 164,
    'ù': 165,
    //'page backward': 166,
    //'page forward': 167,
    'refresh': 168,
    //'closing paren (AZERTY)': 169,
    '*': 170,
    //'~ + * key': 171,
    'home key': 172,
    //'minus (firefox), mute/unmute': 173,
    //'decrease volume level': 174,
    //'increase volume level': 175,
    'next': 176,
    'previous': 177,
    'stop': 178,
    //'play/pause': 179,
    'e-mail': 180,
    //'mute/unmute (firefox)': 181,
    //'decrease volume level (firefox)': 182,
    //'increase volume level (firefox)': 183,
    //'semi-colon / ñ': 186,
    //'equal sign': 187,
    'comma': 188,
    'dash': 189,
    'period': 190,
    //'forward slash / ç': 191,
    //'grave accent / ñ / æ / ö': 192,
    //'?, / or °': 193,
    //'numpad period (chrome)': 194,
    'open bracket': 219,
    'back slash': 220,
    //'close bracket / å': 221,
    //'single quote / ø / ä': 222,
    //'`': 223,
    //'left or right ⌘ key (firefox)': 224,
    'altgr': 225,
    //'< /git >, left back slash': 226,
    //'GNOME Compose Key': 230,
    'ç': 231,
    //'XF86Forward': 233,
    //'XF86Back': 234,
    //'non-conversion': 235,
    //'alphanumeric': 240,
    //'hiragana/katakana': 242,
    //'half-width/full-width': 243,
    //'kanji': 244,
    //'unlock trackpad (Chrome/Edge)': 251,
    //'toggle touchpad': 255,
}