module.exports = {
    bindAll: (func) => {
        Object.getOwnPropertyNames(func).forEach((f) => {
            if (typeof func[f] === 'function') {
                func[f] = func[f].bind(func)
            }
        });
    }
}