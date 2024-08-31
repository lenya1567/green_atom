import { flow, makeObservable, observable } from "mobx";
import { fetchAlbumsRequest } from "../requests";

class AlbumsState {

    albums = [];

    constructor() {
        makeObservable(this, {
            albums: observable,
            fetchAlbums: flow,
        });
    }

    *fetchAlbums() {
        this.albums = yield fetchAlbumsRequest();
    }
}

export default AlbumsState;