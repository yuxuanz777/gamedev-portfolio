import type { Locale } from '@/i18n'

export type LocalizedValue = string | Record<Locale, string>

export function localize(value: LocalizedValue, locale: Locale): string {
    return typeof value === 'string' ? value : value[locale]
}

export default class ProjectData {
    id: string;
    name: LocalizedValue;
    htmlDescription: LocalizedValue;
    iconUrl: string; // used as thumnail
    isWide: boolean; // thumbnail will take 2 cols in the grid view
    isHigh: boolean; // thumbnail will take 2 rows in the grid view
    accentColor: string; // color of title bar
    tags: string[];
    year: string;

    constructor(id: string, name: LocalizedValue, iconUrl: string, html: LocalizedValue, accentColor = "#000000", isHigh = false, isWide = false, tags: string[] = [], year = ''){
        this.id = id;
        this.name = name;
        this.htmlDescription = html;
        this.iconUrl = iconUrl;
        this.isHigh = isHigh;
        this.isWide = isWide;
        this.accentColor = accentColor;
        this.tags = tags;
        this.year = year;
    }
}
