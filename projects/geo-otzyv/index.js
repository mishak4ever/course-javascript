class YandexMap {
    constructor(mapId) {
        this.mapId = mapId;
        this.loadMap();
    }

    async loadMap() {
        await ymaps.ready();
        this.init();
    }

    init() {
        this.YMap = new ymaps.Map(this.mapId, {
            center: [55.76, 37.64],
            zoom: 10,
        });

        this.YMap.events.add('click', function (e) {
                var coords = e.get('coords');
                this.onClick(coords)
            // if (!this.YMap.balloon.isOpen()) {
            //     var coords = e.get('coords');
            //     this.onClick(coords)
            // } else {
            //     this.closeBalloon();
            // }
        });
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
        this.YMap.openBalloon(coords, 'Загрузка...');
        // const list = await this.callApi('list', {coords});
        const list = {
            "55.80527279361752_37.52327026367186": [{
                "name": "Сергей",
                "place": "Кофемания",
                "text": "Очень вкусно"
            }, {"name": "Андрей", "place": "Кофемания", "text": "Согласен с Сергеем"}]
        };
        const form = this.createForm(coords, list);
        this.YMap.setBalloonContent(form.innerHTML);
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
}