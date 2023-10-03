const extractIdFromUserUrl = (url) => {
    try {
        const path = url.split('/');
        return path[path.length - 1];

    } catch(e) {
        return -1;
    }
}

const extractIdFromUpdateHobbiesUrl = (url) => {
    try {
        const path = url.split('/');
        return path[path.length - 3];

    } catch(e) {
        return -1;
    }
}

const extractIdFromHobbiesUrl = (url) => {
    try {
        const path = url.split('/');
        return path[path.length - 2];

    } catch(e) {
        return -1;
    }
}

module.exports = { extractIdFromUserUrl, extractIdFromUpdateHobbiesUrl, extractIdFromHobbiesUrl, extractHobbyFromUrl: extractIdFromUserUrl };