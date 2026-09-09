export interface GalleryImage {
    id: string;
    url: string;
}

export interface GalleryProps {
    principal?: string;
    images?: GalleryImage[];
}