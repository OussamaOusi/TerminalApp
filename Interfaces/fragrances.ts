import {
    Details
} from "./details"

export interface Fragrances{
    id:                number;
    name:              string;
    description:       string;
    age:               number;
    has_website:       boolean;
    releasedate:       Date;
    profile_image_url: string;
    category:          string;
    price:             number;
    season:            string[];
    details:    Details;
}