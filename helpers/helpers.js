const extractId = (url) => {
    try {
        const path = url.split('/');
        return path[path.length - 1];

    } catch(e) {
        return -1;
    }
}

module.exports = extractId;