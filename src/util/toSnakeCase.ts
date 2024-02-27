export function toSnakeCase(text: string) {
    // Complex and complete regex string thanks to https://github.com/zellwk/javascript/issues/14
    return text
        .replace(
            /([^\p{L}\d]+|(?<=\p{L})(?=\d)|(?<=\d)(?=\p{L})|(?<=[\p{Ll}\d])(?=\p{Lu})|(?<=\p{Lu})(?=\p{Lu}\p{Ll})|(?<=[\p{L}\d])(?=\p{Lu}\p{Ll}))/gu,
            '_',
        )
        .toLowerCase()
}
