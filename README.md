# Тестовое задание на CaseLab JavaScript.

## Решение

Для выполения задания были использованы библиотеки Directus (backend-часть), React и MobX (frontend-часть). Для удобства обмена данными с Directus был также использован пакет @directus/sdk.

На сайте реализованы две страницы - ```AlbumsPage``` и ```PhotosPage```. Весь исходный код frontend-части расположен в папке ```app```.

### Страница AlbumsPage (```src/pages/AlbumsPage.jsx```)

Начальная страница сайта (```/```), отображающая все доступные альбомы. За управление состоянием страницы отвечает ```AlbumsState```, имеющий следующую структуру:

- ```albums```: (```observable```) хранит все альбомы в виде объектов с полями ```id```, ```name```, ```photos_count``` и ```photos``` (хранит ID одного фото из альбома).
- ```fetchAlbums```: (```flow```) вызывается при открытии страницы; выполняет вызов функции ```fetchAlbumsRequest()```, получая все доступные альбомы.

При клике на нужный альбом происходит переход на страницу ```/albums/[ID альбома]/0```.

### Страница PhotosPage (```src/pages/PhotosPage.jsx```)

Страница показа фотографий выбранного альбома. URL страницы может быть двух видов (без показа конкретного фото и с показом) - ```/albums/[ID альбома]/[Номер страницы]``` или ```/albums/[ID альбома]/[Номер страницы]/photo/[Номер фото]```. За управление страницей отвечает ```PhotosState```, имеющий следующую структуру:

- ```albumName```: (```observable```) хранит название открытого альбома.
- ```albumIndex```: (```observable```) хранит ID открытого альбома.
- ```pageIndex```: (```observable```) хранит номер отрытой страницы (номер начинается с 0).
- ```photoIndex```: (```observable```) хранить номер открытого фото (номер начинается с 0; -1 означает, что никакое фото не открыто).
- ```photos```: (```observable```) хранит ID фото, расположенных на странице ```pageIndex``` (каждая страница содержит максимум 12 фото).
- ```photosCount```: (```observable```) хранит общее количество фото в открытом альбоме.
- ```activePhotoLink```: (```computed```) возвращает URL для скачивания открытой картинки.
- ```pageCount```: (```computed```) возвращает количество страниц данного альбома (```photosCount / 12``` с округлением в большую сторону).
- ```fetchAlbum```: (```flow```) вызывается при открытии страницы; выполняет вызов функции ```fetchAlbumRequest()```, получая данные открытого альбома (название и фотографии страницы - номер нужной страницы берётся из URL).
- ```selectPage```: (```flow```) выполняет вызов функции ```fetchPageRequest()```, получая ID всех фото данной страницы.
- ```selectPhoto```: (```action```) вызывается при выборе фото для просмотра или при закрытии просмотра фото (в ```photoIndex``` запишется -1). 
- ```previousPhoto```: (```action```) вызывается при нажатие на стрелку влево при просмотре фото; уменьшает ```photoIndex``` на 1 (если ```photoIndex``` равнялось ```0```, то запишется ```photosCount - 1```); если предыдущее фото находится на другой странице, то вызывается функция ```selectPage()```.
- ```nextPhoto```: (```action```) вызывается при нажатие на стрелку вправо при просмотре фото; увеличивает ```photoIndex``` на 1 (если ```photoIndex``` равнялось ```photosCount - 1```, то запишется ```0```); если следующее фото находится на другой странице, то вызывается функция ```selectPage()```.
- ```setLocation```: (```action```) вызывается при нажатии на кнопки навигации браузера (вперёд / назад); изменяет состояние страницы, согласно URL.

В соответствии с заданием, в списке альбомов и в списке фотографий конкретного альбома фото отображаются с качеством в ```25%``` (сжатие происходит на сервере). При показе фотографии во всплывающем окне фото отображается без ухуждения качества.

Расположение альбомов и фотографий альбома реализовано с помощью ```display: grid```.

### Пагинация

На каждой странице отображется максимум 12 фоторафий. Переход между страницами осуществляется по выбору нужной страницы в верхнем правом углу экрана.

### Мобильная (адаптивная) вёрстка

При уменьшении размера экрана размер фотографий уменьшается до минимального, а потом происходит перенос последних фотографий в каждой строке на следующую. В мобильной версии фотографии показываются по одной в каждой строке. Аналогично происходит на странице альбомов.

### Запросы (```src/requests.js```)

- ```fetchAlbumsRequest()``` запрашивает все доступные альбомы.
- ```fetchAlbumRequest(albumIndex, pageIndex)``` запрашивает информацию об альбоме ```albumIndex``` и его фотографии на странице ```pageIndex```.
- ```fetchPageRequest(albumIndex, pageIndex)``` запрашивает фотографии альбома ```albumIndex``` на странице ```pageIndex```.

### Cтруктура базы данных

В БД создана коллекция ```Album``` имеющая поля:

- ```id```: идентификатор альбома
- ```name```: (```String```) название альбома
- ```photos```: (```ManyToMany```) список фотографий (используются ```directus_files```)

## Запуск

Для запуска необходимо выполнить команду ```docker compose up``` в корневой папке проекта. После запуска ```Directus``` будет доступен по ```localhost:8055```, а frontend будет доступен по ```localhost:3000```.

Для тестирования в БД уже добавлены два альбома и 44 фото.

## Тестирование

Тестирование происходило в браузере Google Chrome под MacOS.

![Страница альбомов](https://github.com/lenya1567/green_atom/raw/master/images/albums_page_view.png)
![Страница фотографий](https://github.com/lenya1567/green_atom/raw/master/images/photos_page_view.png)
![Показ другой страницы](https://github.com/lenya1567/green_atom/raw/master/images/another_page_view.png)
![Показ выбранной фотографии](https://github.com/lenya1567/green_atom/raw/master/images/photo_view.png)
![Мобильная версия](https://github.com/lenya1567/green_atom/raw/master/images/adaptive_view.png)

