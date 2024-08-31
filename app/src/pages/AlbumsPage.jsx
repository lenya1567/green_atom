import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import '../index.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import loupeImageURL from "../assets/loupe.svg";

export function cutArrayBy(arr, n) {
    console.log(n);
    let result = [];
    for (let i = 0; i < arr.length; i += n) {
        result.push(arr.slice(i, i + n));
    }
    if (result.length > 0) {
        while (result.at(-1).length != n) {
            result.at(-1).push(null);
        }
    }
    return result;
}

export default observer((props) => {

    const changeLocation = useNavigate();

    useEffect(() => {
        props.state.fetchAlbums();
    }, []);

    console.log(isMobile);

    return (
        <div className="albums">
            <h1>Мои альбомы</h1>
            <div className='albums-list'>
                {
                    props.state.albums.map((album, I) =>
                        <div key={`album-${I}`} className='album' onClick={() => changeLocation(`/album/${album.id}/0`)} style={album == null ? { opacity: 0, cursor: "default" } : {}}>
                            <div className='image'>
                                <div className='loupe'>
                                    <img src={loupeImageURL} />
                                </div>

                                {album.photos_count > 0 && <img height="100%" src={
                                    `http://localhost:8055/assets/${album.photos[0].directus_files_id}?quality=25`
                                } />}

                            </div>
                            <div className='title'>
                                {album.name}
                            </div>
                            <div className='photos-count'>
                                {album.photos_count} фото
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
});