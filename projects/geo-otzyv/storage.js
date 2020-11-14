const storageKey = "YmapReview";

class Storage {
    constructor() {
        this.data = JSON.parse(localStorage.getItem(storageKey)) || {};
    }

    validateReview(review) {
        if (!review.name)
            throw new Error('empty_name');
        if (!review.place)
            throw new Error('empty_place');
        if (!review.text)
            throw new Error('empty_text');
    }

    addReview(obj) {
        this.validateReview(obj.review);
        const coords = `${obj.coords[0]}_${obj.coords[1]}`;
        this.data[coords] = this.data[coords] || [];
        this.data[coords].push(obj.review);
        this.updateStorage();
    }
    delReview(coords) {
        const index = `${coords[0]}_${coords[1]}`;
        delete this.data[index];
        this.updateStorage();
    }

    getAllCoords() {
        const coords = [];

        for (const item in this.data) {
            coords.push({
                coords: item.split('_'),
                reviews: this.data[item]
            });
        }
        // console.log(coords);
        return coords;
    }

    getReviewByCoords(coords) {
        const index = `${coords[0]}_${coords[1]}`;
        return this.data[index] || [];
    }

    updateStorage() {
        // console.log('update');
        localStorage.setItem(storageKey, JSON.stringify(this.data));
    }
}
