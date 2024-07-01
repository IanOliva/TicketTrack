const entries = [];

const renderAboutus = (req, res) => {
    res.render('about-us', {entries});
};

const renderNewEntry = (req, res) => {
    res.render('new-entry');
};

const createNewEntry = (req, res) => {
    const newEntry = {
        title: req.body.title,
        content: req.body.contenido,
        publish: new Date(),
    };
    entries.push(newEntry);
    res.redirect('/');
};

module.exports = {
    renderAboutus,
    renderNewEntry,
    createNewEntry
};