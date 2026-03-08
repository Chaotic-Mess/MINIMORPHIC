/*
   =============================================
   MINIMORPHIC — JSONC Parser Utility [JS]
   =============================================
*/

(function () {
    function stripComments(input) {
        let out = '';
        let inString = false;
        let escaping = false;

        for (let i = 0; i < input.length; i++) {
            const ch = input[i];
            const next = input[i + 1];

            if (inString) {
                out += ch;
                if (escaping) {
                    escaping = false;
                } else if (ch === '\\') {
                    escaping = true;
                } else if (ch === '"') {
                    inString = false;
                }
                continue;
            }

            if (ch === '"') {
                inString = true;
                out += ch;
                continue;
            }

            if (ch === '/' && next === '/') {
                i += 2;
                while (i < input.length && input[i] !== '\n' && input[i] !== '\r') i++;
                i -= 1;
                continue;
            }

            if (ch === '/' && next === '*') {
                i += 2;
                while (i < input.length - 1 && !(input[i] === '*' && input[i + 1] === '/')) i++;
                i += 1;
                continue;
            }

            out += ch;
        }

        return out;
    }

    function stripTrailingCommas(input) {
        let out = '';
        let inString = false;
        let escaping = false;

        for (let i = 0; i < input.length; i++) {
            const ch = input[i];

            if (inString) {
                out += ch;
                if (escaping) {
                    escaping = false;
                } else if (ch === '\\') {
                    escaping = true;
                } else if (ch === '"') {
                    inString = false;
                }
                continue;
            }

            if (ch === '"') {
                inString = true;
                out += ch;
                continue;
            }

            if (ch === ',') {
                let j = i + 1;
                while (j < input.length && /\s/.test(input[j])) j++;
                if (input[j] === '}' || input[j] === ']') {
                    continue;
                }
            }

            out += ch;
        }

        return out;
    }

    function parse(jsoncString) {
        const noComments = stripComments(String(jsoncString));
        const normalized = stripTrailingCommas(noComments);
        return JSON.parse(normalized);
    }

    const api = {
        parse,
        stringify: JSON.stringify.bind(JSON)
    };

    window.parseJSONC = parse;
    window.MM_JSONC = api;

    // Backward compatibility for legacy callsites that still expect JSONC.*
    if (!window.JSONC) {
        window.JSONC = api;
    }
})();
