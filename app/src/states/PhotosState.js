import { action, computed, flow, makeObservable, observable } from "mobx";
import { fetchAlbumRequest, fetchPageRequest } from "../requests";

class PhotosState {

    albumName = ""

    albumIndex = -1;
    pageIndex = -1;
    photoIndex = -1;

    photos = [];
    photosCount = 0;

    pageStatus = 0

    constructor() {
        makeObservable(this, {
            albumName: observable,
            photos: observable,
            photosCount: observable,

            albumIndex: observable,
            pageIndex: observable,
            photoIndex: observable,

            pageStatus: observable,

            activePhotoLink: computed,
            pageCount: computed,

            fetchAlbum: flow,
            selectPage: flow,

            selectPhoto: action,
            previousPhoto: action,
            nextPhoto: action,

            setLocation: action,
        });
    }

    get activePhotoLink() {
        if (this.photoIndex >= 0 && this.photoIndex < this.photosCount && this.pageStatus == 0) {
            return `http://localhost:8055/assets/${this.photos[this.photoIndex % 12].directus_files_id}`;
        } else {
            return "";
        }
    }

    get pageCount() {
        return this.photosCount == 0 ? 1 : Math.ceil(this.photosCount / 12);
    }

    *fetchAlbum(albumIndex, pageIndex, photoIndex) {
        let albumObject = yield fetchAlbumRequest(albumIndex, pageIndex);

        this.photos = albumObject.photos;
        this.photosCount = albumObject.photos_count;
        this.albumName = albumObject.name;

        this.albumIndex = albumIndex;
        this.pageIndex = pageIndex;
        this.photoIndex = photoIndex;
    }

    *selectPage(index) {
        this.pageStatus = 1;
        this.pageIndex = index;
        this.photos = yield fetchPageRequest(this.albumIndex, this.pageIndex);
        this.pageStatus = 0;
        return `/album/${this.albumIndex}/${this.pageIndex}`;
    }

    selectPhoto(index) {
        this.photoIndex = index == -1 ? -1 : index + this.pageIndex * 12;
        return index != -1
            ? `/album/${this.albumIndex}/${this.pageIndex}/photo/${this.photoIndex}`
            : `/album/${this.albumIndex}/${this.pageIndex}`;
    }

    previousPhoto() {
        this.photoIndex = (this.photoIndex - 1 + this.photosCount) % this.photosCount;
        if (this.pageIndex != Math.floor(this.photoIndex / 12)) {
            this.selectPage(Math.floor(this.photoIndex / 12));
        }
        return `/album/${this.albumIndex}/${this.pageIndex}/photo/${this.photoIndex}`;
    }

    nextPhoto() {
        this.photoIndex = (this.photoIndex + 1) % this.photosCount;
        if (this.pageIndex != Math.floor(this.photoIndex / 12)) {
            this.selectPage(Math.floor(this.photoIndex / 12));
        }
        return `/album/${this.albumIndex}/${this.pageIndex}/photo/${this.photoIndex}`;
    }

    setLocation(albumIndex, newPageIndex, photoIndex) {
        this.albumIndex = albumIndex;
        if (this.pageIndex != newPageIndex) {
            this.selectPage(newPageIndex);
        }
        this.selectPhoto(photoIndex % 12);
    }

}

export default PhotosState;