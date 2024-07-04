/**
 * Checks if the given string is a valid MongoDB ObjectId.
 * @param id - The string to check.
 * @returns True if the string is a valid ObjectId, false otherwise.
 */
export function isValidObjectId(id: string): boolean {
    if (id.length !== 24) {
        return false;
    }
    const hexRegExp = /^[0-9a-fA-F]{24}$/;
    return hexRegExp.test(id);
}
