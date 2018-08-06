function chock(ms) {
    const dt = Date.now()
    while(Date.now() < dt + ms) {}
}

module.exports = {
    chock
}
