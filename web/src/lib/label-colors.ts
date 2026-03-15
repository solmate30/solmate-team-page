export const LABEL_COLORS = [
    { id: 'red',    bg: 'bg-red-100',    text: 'text-red-700',    dark: 'dark:bg-red-900/30 dark:text-red-400',    dot: 'bg-red-500' },
    { id: 'orange', bg: 'bg-orange-100', text: 'text-orange-700', dark: 'dark:bg-orange-900/30 dark:text-orange-400', dot: 'bg-orange-500' },
    { id: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-700', dark: 'dark:bg-yellow-900/30 dark:text-yellow-400', dot: 'bg-yellow-500' },
    { id: 'green',  bg: 'bg-green-100',  text: 'text-green-700',  dark: 'dark:bg-green-900/30 dark:text-green-400',  dot: 'bg-green-500' },
    { id: 'blue',   bg: 'bg-blue-100',   text: 'text-blue-700',   dark: 'dark:bg-blue-900/30 dark:text-blue-400',   dot: 'bg-blue-500' },
    { id: 'purple', bg: 'bg-purple-100', text: 'text-purple-700', dark: 'dark:bg-purple-900/30 dark:text-purple-400', dot: 'bg-purple-500' },
    { id: 'pink',   bg: 'bg-pink-100',   text: 'text-pink-700',   dark: 'dark:bg-pink-900/30 dark:text-pink-400',   dot: 'bg-pink-500' },
    { id: 'gray',   bg: 'bg-gray-100',   text: 'text-gray-700',   dark: 'dark:bg-gray-800 dark:text-gray-300',      dot: 'bg-gray-500' },
] as const;

export type LabelColorId = typeof LABEL_COLORS[number]['id'];

export function getLabelColor(id: string) {
    return LABEL_COLORS.find((c) => c.id === id) ?? LABEL_COLORS[7];
}
