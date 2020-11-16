class YandexMap {
    constructor(mapId) {
        this.mapId = mapId;
        this.loadMap();
        var form = document.querySelector('#map');
        form.addEventListener('click', this.onFormClick.bind(this));
    }

    async loadMap() {
        await ymaps.ready();
        this.init();
        this.loadReviews();
    }

    async loadReviews() {
        const storage = new Storage();
        const list = await storage.getAllCoords();
        for (const record of list) {
            record.reviews.forEach(() => this.createPlacemark(record.coords));
        }
    }


    init() {
        this.clusterer = new ymaps.Clusterer({
            groupByCoordinates: true,
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: false,
        });
        this.clusterer.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
        });

        this.YMap = new ymaps.Map(this.mapId, {
            center: [55.76, 37.64],
            zoom: 10,
        });
        this.YMap.geoObjects.add(this.clusterer);
        this.YMap.events.add('click', (e) => this.onClick(e.get('coords')));

    }

    openBalloon(coords, content) {
        this.YMap.balloon.open(coords, content);
    }

    setBalloonContent(content) {
        this.YMap.balloon.setData(content);
    }

    closeBalloon() {
        this.YMap.balloon.close();
    }


    async onClick(coords) {
        const storage = new Storage();
        const list = storage.getReviewByCoords(coords);
        const form = this.createForm(coords, list);
        this.setBalloonContent(form.innerHTML);
        this.openBalloon(coords);
    }

    createForm(coords, reviews) {

        const root = document.createElement('div');
        root.innerHTML = document.querySelector('#addFormTemplate').innerHTML;
        const reviewList = root.querySelector('.review-list');
        const reviewForm = root.querySelector('[data-role=review-form]');
        reviewForm.dataset.coords = JSON.stringify(coords);

        for (const item of reviews) {
            const div = document.createElement('div');
            div.classList.add('review-item');
            div.innerHTML = `
                <div>
                 <b>${item.name}</b> [${item.place}]
                </div>
                 <div>${item.text}</div>
                `;
            reviewList.appendChild(div);
        }
        return root;
    }

    async onFormClick(e) {
        if (e.target.dataset.role === 'review-add') {
            const reviewForm = document.querySelector('[data-role=review-form]');
            const coords = JSON.parse(reviewForm.dataset.coords);
            const data = {
                coords,
                review: {
                    name: document.querySelector('[data-role=review-name]').value,
                    place: document.querySelector('[data-role=review-place]').value,
                    text: document.querySelector('[data-role=review-text]').value,
                },
            };
            var elements;
            if (elements = document.querySelectorAll('[class="form-error"]')) {
                for (let elem of elements) {
                    elem.innerText = "";
                }
            }

            try {
                const storage = new Storage();
                await storage.addReview(data);

                this.createPlacemark(coords);
                this.closeBalloon();
            } catch (e) {
                var formError;
                switch (e.message) {
                    case "empty_name":
                        formError = document.querySelector('#span-name');
                        break;
                    case "empty_place":
                        formError = document.querySelector('#span-place');
                        break;
                    case "empty_text":
                        formError = document.querySelector('#span-text');
                        break;
                    default:
                        formError = document.querySelector('#span-common');
                }
                formError.innerText = "Поле не заполнено";
            }
        } else if (e.target.dataset.role === 'place-del') {
            const reviewForm = document.querySelector('[data-role=review-form]');
            const coords = JSON.parse(reviewForm.dataset.coords);
            const storage = new Storage();
            await storage.delReview(coords);
            this.deletePlacemark(coords);
            this.closeBalloon();
        }
    }

    createPlacemark(coords) {
        // console.log(this.clusterer);
        var myPlacemark = new ymaps.Placemark(coords);
        myPlacemark.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
        });
        this.clusterer.add(myPlacemark);
    }

    deletePlacemark(coords) {
        const geoObjects = this.clusterer.getGeoObjects()
        const geoObject = geoObjects.find(object => {
            const currentCoords = JSON.stringify(object.geometry.getCoordinates())
            const targetCoords = JSON.stringify(coords)
            if (currentCoords === targetCoords) {
                return object
            }
        })
        this.clusterer.remove(geoObject);
    }
}