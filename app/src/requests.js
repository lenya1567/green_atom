import { createDirectus, rest, readItems, readItem, readAssetRaw, readRelation, readAssetBlob, readField } from '@directus/sdk';

export function getDirectusClient() {
    return createDirectus('http://localhost:8055').with(rest({ credentials: 'include' }));
}

export async function fetchAlbumsRequest() {
    const client = getDirectusClient();
    const albums = await client.request(readItems("Album", {
        fields: ["id", "name", "photos.directus_files_id", "count(photos)"],
        deep: {
            "photos": {
                "_limit": 1,
            }
        }
    }));
    return albums;
}

export async function fetchAlbumRequest(albumIndex, pageIndex) {
    const client = getDirectusClient();
    const album = await client.request(readItem('Album', `${albumIndex}`, {
        fields: ["id", "name", "photos.directus_files_id", "count(photos)"],
        deep: {
            "photos": {
                "_offset": pageIndex * 12,
                "_limit": 12,
            }
        }
    }));
    return album;
}

export async function fetchPageRequest(albumIndex, pageIndex) {
    const client = getDirectusClient();
    const albumPhotos = await client.request(readItem('Album', `${albumIndex}`, {
        fields: ["photos.directus_files_id"],
        deep: {
            "photos": {
                "_offset": pageIndex * 12,
                "_limit": 12,
                "_sort": "directus_files_id.created_on"
            }
        }
    }));
    return albumPhotos.photos;
}
