
export interface Fragrances {
    id: number;
    name: string;
    description: string;
    age: number;
    has_website: boolean;
    releasedate: Date;
    profile_image_url: string;
    category: string;
    price: number;
    season: string[];
    details: Details;
}

export interface Details {
    id: number;
    notes: Notes;
}

export interface Notes {
    top_notes: string[];
    middle_notes: string[];
    base_notes: string[];
}