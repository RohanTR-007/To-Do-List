
module.exports = getDate;
function getDate() {
    // var today = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    // var today = new Date().toLocaleDateString("en-US", options);
    return new Date().toLocaleDateString("en-US", options);
}

